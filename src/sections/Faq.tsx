'use client'

import { motion } from 'framer-motion'
import { useId, useState } from 'react'
import { Reveal } from '../components/Reveal'
import { durations, ease, usePreviewMode, useStaticMotion } from '../lib/motion'
import styles from './Faq.module.css'

type FaqItem = { q: string; a: string }

/**
 * Home: Figma "FAQ" (532:25034) using the component set "Plexo / FAQ Accordion" (238:2338).
 * Default = "Open item=None" (the page instance: all closed). One item open at a time; clicking the
 * open item closes it. Answers and the open style come from the "Open item=N" variants.
 */
const homeFaqs: FaqItem[] = [
  { q: 'Do I need to code or design?', a: 'Nope. If you can type it, Plexo can build it.' },
  { q: 'What happens after the trial?', a: 'Your pages go offline. Your work stays saved. Upgrade anytime to go live again.' },
  { q: 'Can I use my own domain?', a: 'Yes, on every paid plan. SSL is on us.' },
  { q: 'Can I sell on Plexo?', a: 'Yes. 5 products on Starter, 25 on Pro.' },
  { q: "What's MCP?", a: 'It lets Claude, ChatGPT and other AI tools build on Plexo for you. Totally optional.' },
  {
    q: 'What are AI credits?',
    a: 'Each time Plexo AI builds or edits something, it uses credits. Every plan comes with a monthly top up.',
  },
  { q: "I'm on WordPress. Can I switch?", a: 'Paste your link. Posts, images and rankings come with you.' },
  { q: 'Am I locked in?', a: 'Never. Export your code anytime.' },
  { q: 'Can I cancel?', a: 'Anytime. Plus a 7 day money back guarantee.' },
]

/**
 * Pricing page: Figma "FAQ" (571:11799) using the component set "FAQ Pricing" (613:19248). The page
 * instance is "Open item=7", so the last question starts open. Answers are verbatim from the variants.
 */
const pricingFaqs: FaqItem[] = [
  { q: 'What happens after the trial?', a: 'Your pages go offline. Your work stays saved. Upgrade anytime to go live again.' },
  { q: 'Can I switch plans later?', a: 'Yes. Upgrade or downgrade anytime. We prorate the difference.' },
  { q: 'Do you charge transaction fees?', a: 'Yes, on every paid plan. SSL is on us.' },
  { q: 'Can I pay in Naira?', a: 'Yes.' },
  { q: 'Is yearly billing worth it?', a: 'Yes. You get 2 months free on Starter and Pro.' },
  { q: 'Do you offer discounts?', a: 'Yes' },
  { q: 'How does Enterprise billing work?', a: 'Custom contract, invoice billing and a dedicated contact. Talk to us.' },
]

/**
 * Build with Sol: Figma "FAQ" (616:21365) using "FAQ / Build with Sol" (614:20522). The page instance is
 * "Open item=1", so the first question starts open. Answers are verbatim from the variants.
 */
const solFaqs: FaqItem[] = [
  { q: 'Do I need to be good at writing prompts?', a: 'No. Write like you would text a friend. Sol asks if it needs more.' },
  { q: 'Can I edit what Sol makes?', a: 'Yes. Chat to change it or drag anything on the canvas.' },
  { q: 'Who owns what Sol creates?', a: 'You do. Every page, image and line of copy.' },
  { q: 'Does Sol use my content to train AI?', a: 'Yes.' },
]

/**
 * E-commerce: Figma "FAQ" (736:14742) using "Ecommerce FAQ" (923:6372), laid out as Build with Sol's.
 * All three start closed. Figma has no answers for them: the first is from the frame's earlier version
 * ("No. You only pay your payment provider."), the other two are drafts from the page's own copy.
 */
const ecommerceFaqs: FaqItem[] = [
  { q: 'Do you take a cut of my sales?', a: 'No. You only pay your payment provider.' },
  { q: 'How do I get paid?', a: 'Customers pay at checkout with Paystack, Flutterwave or a card, and your payment provider pays you out.' },
  { q: 'Can I sell on Instagram too?', a: 'Yes. Share your product links on Instagram and buyers check out on your store, not in your DMs.' },
]

type FaqVariant = 'home' | 'pricing' | 'sol' | 'ecommerce'

const variants: Record<FaqVariant, { items: FaqItem[]; defaultOpen: number | null; style?: 'pricing' | 'sol' }> = {
  home: { items: homeFaqs, defaultOpen: null },
  pricing: { items: pricingFaqs, defaultOpen: pricingFaqs.length - 1, style: 'pricing' },
  sol: { items: solFaqs, defaultOpen: 0, style: 'sol' },
  ecommerce: { items: ecommerceFaqs, defaultOpen: null, style: 'sol' },
}

// Plus (closed) / minus (open). Same geometry as the Figma "Plus" icon: 12px bars, 1px thick,
// rounded ends, #333332. Opening collapses the vertical bar so the plus morphs into a minus.
function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg className={`${styles.icon} ${open ? styles.iconOpen : ''}`} viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2" y="7.5" width="12" height="1" rx="0.5" />
      <rect className={styles.iconBar} x="7.5" y="2" width="1" height="12" rx="0.5" />
    </svg>
  )
}

export default function Faq({ variant = 'home' }: { variant?: FaqVariant }) {
  const { items, defaultOpen, style } = variants[variant]
  const isPreviewMode = usePreviewMode()
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)
  const isStatic = useStaticMotion()
  const baseId = useId()
  const sectionClass = [styles.section, style && styles[style], variant === 'ecommerce' && styles.ecommerce].filter(Boolean).join(' ')

  return (
    <section id="faq" data-section="faq" className={sectionClass} aria-labelledby="faq-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.headCol}>
          <h2 id="faq-title" className={`h2 ${styles.title}`}>
            Frequently Asked Questions
          </h2>
        </Reveal>

        <div className={styles.list}>
          {items.map((item, i) => {
            const open = openIndex === i
            const buttonId = `${baseId}-q${i}`
            const panelId = `${baseId}-a${i}`
            return (
              <Reveal key={item.q} delay={Math.min(i, 8) * 0.04} className={styles.item}>
                <h3 className={styles.heading}>
                  <button
                    type="button"
                    id={buttonId}
                    className={styles.trigger}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    <span className={styles.question}>{item.q}</span>
                    <ToggleIcon open={open} />
                  </button>
                </h3>
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!open}
                  inert={!open}
                  className={styles.panel}
                  initial={false}
                  animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                  transition={
                    isStatic
                      ? { duration: 0 }
                      : { height: { duration: durations.base, ease }, opacity: { duration: 0.2, ease } }
                  }
                >
                  {isPreviewMode && !isStatic ? (
                    <motion.p
                      className={styles.answer}
                      initial={false}
                      animate={{ y: open ? 0 : 6 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      {item.a}
                    </motion.p>
                  ) : (
                    <p className={styles.answer}>{item.a}</p>
                  )}
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
