import { PromptBox } from '../components/PromptBox'
import { BlurIn } from '../components/BlurIn'
import { Reveal } from '../components/Reveal'
import { isPreviewMode } from '../lib/motion'
import styles from './FinalCta.module.css'

/**
 * Figma "Final CTA" (532:25039): 1440×430, #f5f7ed, padding 100/80, column gap 64, centred:
 * the heading (692×53, "Frame 57") and the 792-wide prompt box.
 */
export default function FinalCta() {
  return (
    <section id="start" data-section="start" className={styles.cta}>
      <div className="container">
        <div className={styles.inner}>
          <Reveal className={styles.headingBox}>
            <h2 className={`h2 ${styles.title}`}>Ready to bring your idea to life?</h2>
          </Reveal>
          {isPreviewMode ? (
            <BlurIn trigger="view" delay={0.15} blur={10} duration={1.3} className={styles.promptWrap}>
              <PromptBox />
            </BlurIn>
          ) : (
            <Reveal delay={0.08} className={styles.promptWrap}>
              <PromptBox />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
