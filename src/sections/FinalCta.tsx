import { PromptBox } from '../components/PromptBox'
import { BlurIn } from '../components/BlurIn'
import { Reveal } from '../components/Reveal'
import { isPreviewMode } from '../lib/motion'
import styles from './FinalCta.module.css'

/**
 * Figma "Final CTA" (234:2075): 1440×456, #f5f7ed, padding 100/80, column gap 80, centred.
 * The heading sits left-aligned in a centred 596px box ("Frame 57"), so it starts at x=422.
 */
export default function FinalCta() {
  return (
    <section id="start" data-section="start" className={styles.cta}>
      <div className="container">
        <div className={styles.inner}>
          <Reveal className={styles.headingBox}>
            <h2 className={`h2 ${styles.title}`}>So, what are we building?</h2>
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
