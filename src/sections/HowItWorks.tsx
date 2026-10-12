import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { durations, ease, isPreviewMode, useStaticMotion } from '../lib/motion'
import styles from './HowItWorks.module.css'

/**
 * Figma "How it works" (234:934) with the step switcher from "Component 1" (238:1099).
 * Variants: Prop=Start your way (default) / Drag and Drop / Publish and sell.
 * Per-variant values (title→description gap, description colour) are kept as in Figma.
 */
const steps = [
  {
    title: 'Start your way',
    body: 'Type what you want, pick a template, or start from a blank canvas',
    gap: 8,
    bodyClass: styles.bodyMuted,
    img: '/assets/how-step-1.webp',
    alt: 'Plexo templates page with a “How do you want to start?” dialog offering a blank canvas, the template marketplace or uploading a site.',
  },
  {
    title: 'Drag, drop, done',
    body: 'Move sections, swap images, change words. What you see is what goes live.',
    gap: 12,
    bodyClass: styles.bodyMuted,
    img: '/assets/how-step-2.webp',
    alt: 'Plexo drag-and-drop editor with a page preview and a panel of content blocks.',
  },
  {
    title: 'Publish and sell',
    body: 'Go live on your domain and start taking orders and leads today',
    gap: 12,
    bodyClass: styles.bodyStrong,
    img: '/assets/how-step-3.webp',
    alt: 'Plexo hosting screen confirming “Your site is live” with the published web address.',
  },
] as const

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const isStatic = useStaticMotion()
  const uid = useId()
  const screenId = `${uid}-screen`
  const expand = isStatic ? { duration: 0 } : { duration: durations.base + 0.05, ease }
  const fade = isStatic ? { duration: 0 } : { duration: durations.base + 0.1, ease }
  // Preview: blur crossfade, so the outgoing screen softens away while the new one sharpens into focus.
  const blurSwap = isPreviewMode && !isStatic

  return (
    <section id="how-it-works" data-section="how-it-works" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.header}>
            <Reveal className={styles.intro}>
              <h2 className={styles.heading}>Idea to income in three steps.</h2>
              <p className={styles.lead}>Every missing page, slow launch and broken link is a sale going somewhere else.</p>
            </Reveal>
            <Reveal delay={0.06} className={styles.cta}>
              <Button variant="primary" href="#start">
                Start building
              </Button>
            </Reveal>
          </div>

          <div className={styles.body}>
            <Reveal delay={0.06} className={styles.stepsWrap}>
              <ol className={styles.steps} aria-label="How it works">
                {steps.map((step, i) => {
                  const isActive = i === active
                  const descId = `${uid}-desc-${i}`
                  return (
                    <li key={step.title} className={styles.step}>
                      <h3 className={styles.stepHeading}>
                        <button
                          type="button"
                          className={`${styles.stepButton} ${isActive ? styles.stepButtonActive : ''}`}
                          aria-pressed={isActive}
                          aria-controls={screenId}
                          onClick={() => setActive(i)}
                        >
                          <span className={styles.stepNum} aria-hidden="true">
                            {i + 1}.
                          </span>
                          <span className={styles.stepTitle}>{step.title}</span>
                        </button>
                      </h3>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            key="desc"
                            id={descId}
                            className={styles.descWrap}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={expand}
                          >
                            <p className={`${styles.desc} ${step.bodyClass}`} style={{ paddingTop: step.gap }}>
                              {step.body}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ol>
            </Reveal>

            <Reveal delay={0.12} className={styles.browserWrap}>
              <div className={styles.browser} id={screenId}>
                {steps.map((step, i) => {
                  const isActive = i === active
                  return (
                    <motion.img
                      key={step.img}
                      src={step.img}
                      alt={isActive ? step.alt : ''}
                      aria-hidden={!isActive}
                      width={728}
                      height={478}
                      className={styles.shot}
                      initial={false}
                      animate={
                        blurSwap
                          ? { opacity: isActive ? 1 : 0, filter: isActive ? 'blur(0px)' : 'blur(6px)' }
                          : { opacity: isActive ? 1 : 0 }
                      }
                      transition={blurSwap ? { duration: 0.55, ease: [0.33, 1, 0.68, 1] } : fade}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      draggable={false}
                    />
                  )
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
