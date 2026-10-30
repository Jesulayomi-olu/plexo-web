'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { BlurIn } from '../../components/BlurIn'
import { Reveal } from '../../components/Reveal'
import { ease, softSpring, useStaticMotion } from '../../lib/motion'
import { PlanGrid, type Period } from '../Pricing'
import styles from './PricingOverview.module.css'

/**
 * Pricing page, top: Figma "Pricing Hero" (571:11308) and "Pricing" (571:11323).
 * The hero's Monthly / Yearly toggle drives the plan cards below it, so both live here.
 */
function BillingSwitch({ period, onChange }: { period: Period; onChange: (period: Period) => void }) {
  const isStatic = useStaticMotion()
  const yearly = period === 'yearly'

  return (
    <div className={styles.billing}>
      <button type="button" className={styles.billingLabel} onClick={() => onChange('monthly')}>
        Monthly
      </button>
      {/* Figma "Toggle" (571:11316): 36×20 track, 16px white knob with Shadow/sm. */}
      <button
        type="button"
        role="switch"
        aria-checked={yearly}
        aria-label="Bill yearly"
        className={`${styles.switch} ${yearly ? styles.switchOn : ''}`}
        onClick={() => onChange(yearly ? 'monthly' : 'yearly')}
      >
        <motion.span
          className={styles.knob}
          initial={false}
          animate={{ x: yearly ? 16 : 0 }}
          transition={isStatic ? { duration: 0 } : softSpring}
        />
      </button>
      <button type="button" className={styles.billingLabel} onClick={() => onChange('yearly')}>
        Yearly<span className={styles.billingNote}> (2 months Free)</span>
      </button>
    </div>
  )
}

/** The lime corner marks (137×137): they slide in from their corners as the hero loads. */
function Corner({ position }: { position: 'start' | 'end' }) {
  const isStatic = useStaticMotion()
  const start = position === 'start'
  const className = `${styles.corner} ${start ? styles.cornerStart : styles.cornerEnd}`
  const src = start ? '/assets/pricing/hero-corner-tl.svg' : '/assets/pricing/hero-corner-br.svg'
  const image = <img src={src} width={137} height={137} alt="" />

  if (isStatic) return <div className={className}>{image}</div>

  const offset = start ? -48 : 48
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset, y: offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.9, ease, delay: 0.25 }}
    >
      {image}
    </motion.div>
  )
}

export default function PricingOverview() {
  const [period, setPeriod] = useState<Period>('monthly')

  return (
    <>
      <section id="top" data-section="pricing-hero" className={styles.heroSection} aria-labelledby="pricing-hero-title">
        <div className={styles.hero}>
          <Corner position="start" />
          <Corner position="end" />
          <div className={styles.heroContent}>
            <div className={styles.heroCopy}>
              <BlurIn as="h1" blur={14} duration={1.4} className={styles.heroTitle}>
                <span id="pricing-hero-title">
                  Simple pricing
                  <br />
                  {/* Figma starts this line with a space, which counts when centring. */}
                  &nbsp;Real results.
                </span>
              </BlurIn>
              <BlurIn as="p" delay={0.15} blur={8} duration={1.2} className={styles.heroLead}>
                Start free for 14 days. Pay only when your site goes live
              </BlurIn>
            </div>
            <Reveal delay={0.35}>
              <BillingSwitch period={period} onChange={setPeriod} />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="plans" data-section="plans" className={styles.plans} aria-labelledby="plans-title">
        <div className={`container ${styles.plansInner}`}>
          <Reveal>
            <h2 id="plans-title" className={styles.plansTitle}>
              Pricing Plan
            </h2>
          </Reveal>
          <PlanGrid period={period} variant="page" />
        </div>
      </section>
    </>
  )
}
