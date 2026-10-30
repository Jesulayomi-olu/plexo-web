'use client'

import { Reveal } from '../../components/Reveal'
import { CreditGuide } from '../pricing/CreditsGuarantee'
import styles from './SolCredits.module.css'

/**
 * Build with Sol "AI credits" (575:15607 → 614:20325): white, padding 80, row gap 64, centred: the
 * overview (420: 40px heading · 16 · 18px explanation, centred) and the pricing page's credit guide,
 * which here ends "Drag-and-drop edits are always free." Credit costs are still "X Credits" in Figma.
 */
export default function SolCredits() {
  return (
    <section id="credits" data-section="sol-credits" className={styles.section} aria-labelledby="sol-credits-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.overview}>
          <h2 id="sol-credits-title" className={styles.title}>
            Sol uses AI credits
          </h2>
          <p className={styles.lead}>Every time Plexo AI builds or edits something, it uses credits. Your plan’s credits refresh monthly.</p>
        </Reveal>
        <Reveal delay={0.1} className={styles.guideSlot}>
          <CreditGuide reassurance="Drag-and-drop edits are always free." />
        </Reveal>
      </div>
    </section>
  )
}
