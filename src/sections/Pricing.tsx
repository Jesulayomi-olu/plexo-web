'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { Button, type ButtonVariant } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { durations, ease, usePreviewMode, softSpring, useStaticMotion } from '../lib/motion'
import { RollingText } from '../motion/RollingText'
import styles from './Pricing.module.css'

/**
 * Figma "Pricing" (532:24952) using component set "Component 7" (489:6324): "Component 5" = Monthly
 * (default, the page instance), "Component 6" = Yearly. Four 302×489 cards in a row; each has a
 * grey content panel (green for Pro) and a feature list. The toggle switches the Starter and Pro
 * price blocks between the variants.
 */
type Period = 'monthly' | 'yearly'

const periods: { id: Period; label: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
]

type Plan = {
  name: string
  price: (period: Period) => ReactNode
  tagline: string
  cta: { label: string; variant: ButtonVariant; href?: string }
  features: string[]
  /** Pro: green stroke (in layout), shadow stack, green panel and the "Recommended" badge. */
  popular?: boolean
  /** Free Trial: the panel's content is a fixed 205×204 column (button 205 wide, 19px under the tagline). */
  trial?: boolean
}

/**
 * `w` = the Figma text-box width. Figma sizes hugging text boxes to whole pixels (and ignores the
 * trailing letter-spacing), so pinning it keeps the following label exactly where Figma puts it.
 */
function Amount({ children, w }: { children: ReactNode; w: number }) {
  return (
    <span className={styles.amount} style={{ width: w }}>
      {children}
    </span>
  )
}

function Unit({ children, w }: { children: ReactNode; w?: number }) {
  return (
    <span className={styles.unit} style={w ? { width: w } : undefined}>
      {children}
    </span>
  )
}

type PriceText = { text: string; w: number }

/**
 * Starter / Pro price block ("Frame 2147239024").
 * Monthly: 64px block, price line 48px tall ($9 / $19 "Monthly").
 * Yearly: 62px block, price line 46px + "Billed annually (…)" 16px ($7 / $15).
 */
function BillingPrice({
  period,
  monthly,
  yearly,
  billed,
}: {
  period: Period
  monthly: PriceText
  yearly: PriceText
  billed: string
}) {
  const isStatic = useStaticMotion()
  const isPreviewMode = usePreviewMode()

  // Preview: one persistent price whose changed digits roll (odometer); the "Billed annually" line
  // folds open underneath. At rest each state matches its Figma variant exactly.
  if (isPreviewMode && !isStatic) {
    const isYearly = period === 'yearly'
    const price = isYearly ? yearly : monthly
    return (
      <div className={`${styles.priceRow} ${isYearly ? styles.priceRowYearly : ''}`}>
        <div className={styles.priceRollStack}>
          <motion.div
            className={styles.priceLine}
            initial={false}
            animate={{ height: isYearly ? 46 : 48 }}
            transition={{ duration: 0.35, ease }}
          >
            <Amount w={price.w}>
              <RollingText value={price.text} />
            </Amount>
            <Unit>Monthly</Unit>
          </motion.div>
          <AnimatePresence initial={false}>
            {isYearly && (
              <motion.span
                key="billed"
                className={styles.billed}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 16 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease }}
              >
                {billed}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  const content =
    period === 'monthly' ? (
      <div className={styles.priceAlt}>
        <div className={`${styles.priceLine} ${styles.priceLineAlt}`}>
          <Amount w={monthly.w}>{monthly.text}</Amount>
          <Unit>Monthly</Unit>
        </div>
      </div>
    ) : (
      <div className={styles.priceStack}>
        <div className={styles.priceLine}>
          <Amount w={yearly.w}>{yearly.text}</Amount>
          <Unit>Monthly</Unit>
        </div>
        <span className={styles.billed}>{billed}</span>
      </div>
    )

  return (
    <div className={`${styles.priceRow} ${period === 'yearly' ? styles.priceRowYearly : ''}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={period}
          className={styles.priceSwap}
          initial={isStatic ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={isStatic ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: isStatic ? 0 : 0.18, ease }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const plans: Plan[] = [
  {
    name: 'Free Trial',
    price: () => (
      <div className={`${styles.priceRow} ${styles.priceRowFixed}`}>
        <Amount w={54}>$0</Amount>
        <Unit>for 14 days</Unit>
      </div>
    ),
    tagline: 'Take it for a spin.',
    cta: { label: 'Start free', variant: 'white', href: '#top' },
    features: ['1 page,', '1 funnel,', '50 AI credits'],
    trial: true,
  },
  {
    name: 'Starter',
    price: (period) => (
      <BillingPrice period={period} monthly={{ text: '$9', w: 49 }} yearly={{ text: '$7', w: 48 }} billed="Billed annually ($84/year)" />
    ),
    tagline: 'Get online. Start selling.',
    cta: { label: 'Get started', variant: 'white', href: '#top' },
    features: ['5 pages', '5 products', 'Your domain', '300 credits/mo'],
  },
  {
    name: 'Pro',
    price: (period) => (
      <BillingPrice period={period} monthly={{ text: '$19', w: 65 }} yearly={{ text: '$15', w: 65 }} billed="Billed annually ($180/year)" />
    ),
    tagline: 'Grow without limits.',
    cta: { label: 'Go Pro', variant: 'contrast', href: '#top' },
    features: ['15 pages', '5 funnels', '25 products', 'No badge', 'MCP', '1,500 credits/mo'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: () => (
      <div className={`${styles.priceRow} ${styles.priceRowFixed}`}>
        <Unit w={35}>From</Unit>
        <Amount w={73}>$99</Amount>
        <Unit>/month</Unit>
      </div>
    ),
    tagline: 'Built around your team.',
    cta: { label: 'Talk to us', variant: 'outline' },
    features: ['White label', 'Seats', 'SSO', 'SLA'],
  },
]

function PlanCard({ plan, period, delay }: { plan: Plan; period: Period; delay: number }) {
  const isStatic = useStaticMotion()
  const card = [styles.card, plan.popular && styles.cardPopular].filter(Boolean).join(' ')

  return (
    <Reveal delay={delay} className={styles.slot}>
      <motion.article
        className={card}
        aria-label={plan.name}
        whileHover={isStatic ? undefined : { y: -3 }}
        transition={softSpring}
      >
        <div className={styles.panel}>
          <div className={plan.trial ? styles.trialColumn : styles.column}>
          <div className={styles.summary}>
            <div className={styles.titleRow}>
              <h3 className={styles.name}>{plan.name}</h3>
              {plan.popular && <span className={styles.badge}>Recommended</span>}
            </div>
            <div className={styles.pricing}>
              {plan.price(period)}
              <p className={styles.tagline}>{plan.tagline}</p>
            </div>
          </div>
          <Button variant={plan.cta.variant} href={plan.cta.href} fullWidth>
            {plan.cta.label}
          </Button>
          </div>
        </div>
        <ul className={styles.features}>
          {plan.features.map((feature) => (
            <li key={feature} className={styles.feature}>
              <img src="/assets/icons/pricing-check.svg" width={13} height={13} alt="" className={styles.check} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </motion.article>
    </Reveal>
  )
}

function BillingToggle({ period, onChange }: { period: Period; onChange: (period: Period) => void }) {
  const isStatic = useStaticMotion()

  return (
    <div className={styles.toggle}>
      <div className={styles.switch} role="group" aria-label="Billing period">
        {periods.map((p) => {
          const selected = period === p.id
          return (
            <button
              key={p.id}
              type="button"
              className={`${styles.switchItem} ${selected ? styles.switchItemActive : ''}`}
              aria-pressed={selected}
              onClick={() => onChange(p.id)}
            >
              {selected && (
                <motion.span
                  layoutId="pricing-billing-pill"
                  className={styles.pill}
                  transition={isStatic ? { duration: 0 } : { duration: durations.base, ease }}
                />
              )}
              <span className={styles.switchLabel}>{p.label}</span>
            </button>
          )
        })}
      </div>
      <p className={styles.note}>
        <span className={styles.arrow} aria-hidden="true">
          <img src="/assets/icons/pricing-arrow.svg" width={22} height={17} alt="" />
        </span>
        <span className={styles.noteText}>2 months free</span>
      </p>
    </div>
  )
}

export default function Pricing() {
  const [period, setPeriod] = useState<Period>('monthly')

  return (
    <section id="pricing" data-section="pricing" className={styles.section} aria-labelledby="pricing-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <Reveal>
            <h2 id="pricing-title" className={`h2 ${styles.title}`}>
              Try it free
              <br />
              {/* Figma ends this line with a carriage return that counts as a space when centring. */}
              Pay when it&apos;s live.&nbsp;
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className={styles.lead}>Cancel anytime. 7 day money back on paid plans</p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className={styles.toggleWrap}>
          <BillingToggle period={period} onChange={setPeriod} />
        </Reveal>

        <div className={styles.cards}>
          {plans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} period={period} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  )
}
