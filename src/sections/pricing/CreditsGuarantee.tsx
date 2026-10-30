'use client'

import { motion } from 'framer-motion'
import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { ease, softSpring, useStaticMotion } from '../../lib/motion'
import styles from './CreditsGuarantee.module.css'

/**
 * Figma "Plexo · AI credits and guarantee" (571:11727): "AI credits" (intro + "What uses credits?"
 * guide) and "Guarantee" (four promises + "Start your free trial"). Credit costs are still "X Credits"
 * placeholders in Figma.
 */
const creditActions = [
  { icon: 'panels-top-left', label: 'Build a full new page', cost: 'X Credits' },
  { icon: 'text-cursor-input', label: 'Rewrite a section', cost: 'X Credits' },
  { icon: 'mail', label: 'Create an email design', cost: 'X Credits' },
  { icon: 'image', label: 'Change text or an image', cost: 'X Credits' },
]

const promises = [
  { icon: 'table-check', size: 20, title: '14 days free', body: 'No card needed.' },
  { icon: 'table-check', size: 20, title: '7-day money back', body: 'Guaranteed on every paid plan.' },
  { icon: 'table-check', size: 20, title: 'Cancel in two clicks', body: 'Your work stays saved.' },
  // The export icon's artwork is 17px, centred in its 20px frame.
  { icon: 'export', size: 17, title: 'Export anytime', body: 'Your code. No lock-in.' },
]

/** "Credit guide" (also on Build with Sol, 614:20334, which ends with its own reassurance line). */
export function CreditGuide({ reassurance = 'Drag-and-drop edits never use credits.' }: { reassurance?: string }) {
  const isStatic = useStaticMotion()

  return (
    <div className={styles.guide}>
      <div className={styles.guideBody}>
        <h3 className={styles.guideTitle}>What uses credits?</h3>
        <ul className={styles.actions}>
          {creditActions.map((action, i) => (
            <motion.li
              key={action.label}
              className={styles.action}
              initial={isStatic ? false : { opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.07 }}
            >
              <img src={`/assets/pricing/${action.icon}.svg`} width={20} height={20} alt="" className={styles.actionIcon} />
              <span className={styles.actionLabel}>{action.label}</span>
              <span className={styles.actionCost}>{action.cost}</span>
            </motion.li>
          ))}
        </ul>
      </div>
      <p className={styles.freeEdits}>
        <img src="/assets/pricing/table-check.svg" width={20} height={20} alt="" />
        {reassurance}
      </p>
    </div>
  )
}

function PromiseCard({ promise, index }: { promise: (typeof promises)[number]; index: number }) {
  const isStatic = useStaticMotion()

  return (
    <Reveal delay={index * 0.07} className={styles.promiseSlot}>
      <motion.article className={styles.promise} whileHover={isStatic ? undefined : { y: -4 }} transition={softSpring}>
        <motion.span
          className={styles.symbol}
          initial={isStatic ? false : { scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.25 + index * 0.07 }}
        >
          <img src={`/assets/pricing/${promise.icon}.svg`} width={promise.size} height={promise.size} alt="" />
        </motion.span>
        <div className={styles.promiseCopy}>
          <h3 className={styles.promiseTitle}>{promise.title}</h3>
          <p className={styles.promiseBody}>{promise.body}</p>
        </div>
      </motion.article>
    </Reveal>
  )
}

export default function CreditsGuarantee() {
  return (
    <>
      <section id="credits" data-section="credits" className={styles.credits} aria-labelledby="credits-title">
        <div className={styles.creditsInner}>
          <Reveal className={styles.overview}>
            <p className={styles.eyebrow}>
              {/* "AI sparkles": 18.17px artwork centred in a 20px frame. */}
              <span className={styles.sparkles}>
                <img src="/assets/pricing/ai-sparkles.svg" width={18.1707} height={18.1707} alt="" />
              </span>
              Run out of AI credits early? Top up anytime.
            </p>
            <h2 id="credits-title" className={styles.heading}>
              AI credits,
              <br />
              made simple.
            </h2>
            <p className={styles.lead}>
              Every time Plexo AI builds or edits something, it uses credits. Your plan’s credits refresh monthly.
            </p>
          </Reveal>
          <Reveal delay={0.1} className={styles.guideSlot}>
            <CreditGuide />
          </Reveal>
        </div>
      </section>

      <section id="guarantee" data-section="guarantee" className={styles.guarantee} aria-labelledby="guarantee-title">
        <div className={styles.guaranteeInner}>
          <Reveal className={styles.guaranteeHead}>
            <p className={styles.overline}>THE PLEXO GUARANTEE</p>
            <h2 id="guarantee-title" className={styles.heading}>
              Zero risk to try.
            </h2>
          </Reveal>
          <div className={styles.promises}>
            {promises.map((promise, i) => (
              <PromiseCard key={promise.title} promise={promise} index={i} />
            ))}
          </div>
          <Reveal delay={0.2}>
            <Button
              href="/#start"
              size="large"
              trailingIcon={<img src="/assets/pricing/arrow-right.svg" width={20} height={20} alt="" />}
            >
              Start your free trial
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
