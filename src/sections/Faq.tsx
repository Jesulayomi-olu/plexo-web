'use client'

import { motion } from 'framer-motion'
import { useId, useState } from 'react'
import { Reveal } from '../components/Reveal'
import { durations, ease, usePreviewMode, useStaticMotion } from '../lib/motion'
import styles from './Faq.module.css'

/**
 * Figma "FAQ" (532:25034) using the component set "Plexo / FAQ Accordion" (238:2338).
 * Default = "Open item=None" (the page instance: all closed). One item open at a time; clicking the
 * open item closes it. Answers and the open style come from the "Open item=N" variants.
 */
const faqs = [
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

export default function Faq() {
  const isPreviewMode = usePreviewMode()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const isStatic = useStaticMotion()
  const baseId = useId()

  return (
    <section id="faq" data-section="faq" className={styles.section} aria-labelledby="faq-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.headCol}>
          <h2 id="faq-title" className={`h2 ${styles.title}`}>
            Frequently Asked Questions
          </h2>
        </Reveal>

        <div className={styles.list}>
          {faqs.map((item, i) => {
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
