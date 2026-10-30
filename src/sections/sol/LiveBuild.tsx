'use client'

import { Reveal } from '../../components/Reveal'
import buttonStyles from '../../components/Button.module.css'
import styles from './LiveBuild.module.css'

/**
 * Build with Sol, "You direct. AI builds it live." (Figma 575:15548): heading and lead, a 686×403
 * preview window showing the Iron & Grain site, and the prompt card (630×108, 2px #95e021, r16) that
 * asked for it, overlapping the preview's bottom by 54. A still: the prompt is cut to two lines with "…".
 */
// Figma's first line, then the rest, which it cuts mid-word ("bold typograph…").
const FIRST_LINE = 'Build a premium gym website for Iron & Grain'
const REST =
  'with a dark industrial aesthetic, bold typography, and yellow accents. Add a full-width gym photo, a strong hero headline, free-week CTA, today’s class schedule, and a statistics strip below.'
const PROMPT = `${FIRST_LINE} ${REST}`

function PlusIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M3.5411 8.5H8.5M8.5 8.5H13.4589M8.5 8.5V3.5411M8.5 8.5V13.4589" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export default function LiveBuild() {
  return (
    <section id="live-build" data-section="live-build" className={styles.section} aria-labelledby="live-build-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.head}>
          <h2 id="live-build-title" className={styles.title}>
            You direct. AI builds it live.
          </h2>
          <p className={styles.lead}>Talk to SOL like a Designer</p>
        </Reveal>

        <div className={styles.stage}>
          <p className="visually-hidden">Example prompt: {PROMPT} The Iron &amp; Grain website below is what Sol built from it.</p>

          <div className={styles.preview}>
            <img
              src="/assets/sol/iron-and-grain.webp"
              width={595}
              height={793}
              alt="The Iron & Grain gym website: dark gym photography, the headline “Strength is a skill. We coach it.”, a free-week button and today’s class schedule."
              className={styles.result}
            />
          </div>

          <div className={styles.prompt} aria-hidden="true">
            <div className={styles.promptMain}>
              <span className={styles.attach}>
                <PlusIcon />
              </span>
              <div className={styles.textWindow}>
                <p className={styles.text}>
                  <span className={styles.line}>{FIRST_LINE}</span> <span className={styles.line}>{REST}</span>
                </p>
              </div>
            </div>
            <span className={`${buttonStyles.button} ${buttonStyles.primary} ${styles.build}`}>
              <span className={buttonStyles.label}>Build it</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
