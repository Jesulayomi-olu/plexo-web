'use client'

import type { CSSProperties } from 'react'
import { Reveal } from '../../components/Reveal'
import { useFitScale } from '../../lib/useFitScale'
import styles from './Campaign.module.css'

/**
 * Email & Marketing "Campaign section · new" (779:16650): #fcfcfa, 1440×1019. The header (eyebrow
 * "One prompt, whole campaign", "Launch the whole campaign.", a 560-wide lead) at y 67, 5.5px left of
 * centre as in Figma; the 765×694 panel at y 268 (#1d3509 with the lime line pattern under a 20% black
 * wash, r16): glass cards for the prompt you type, Plexo's reply and the three results (page, email,
 * reminder), joined by dashed connectors. Built in HTML at Figma's positions; from 768 to 845 the panel
 * scales down, and phones get the same cards as a column.
 */
const results = [
  { key: 'page', label: 'Page', icon: { src: 'shopping-bag', w: 10.2, h: 11.2, x: 0.9, y: 0.4 } },
  { key: 'email', label: 'Email', icon: { src: 'mail-small', w: 11.2002, h: 9.2, x: 0.4, y: 1.4 } },
  { key: 'reminder', label: 'Reminder', icon: { src: 'alarm-clock', w: 11.2, h: 10.2, x: 0.4, y: 0.9 } },
] as const

const asset = (name: string) => `/assets/features/email/${name}`

export default function Campaign() {
  const { ref, scale, fitted } = useFitScale<HTMLDivElement>(765, 768)

  return (
    <section id="campaign" data-section="campaign" className={styles.section} aria-labelledby="campaign-title">
      <div className="container">
        <Reveal className={styles.header}>
          <p className={styles.eyebrow}>One prompt, whole campaign</p>
          {/* Figma ends the heading with a space, which counts when centring. */}
          <h2 id="campaign-title" className={styles.title}>
            Launch the whole campaign.&nbsp;
          </h2>
          <p className={styles.lead}>
            Tell Plexo what you’re offering. It sets up everything you need to sell before the offer ends.
          </p>
        </Reveal>

        <Reveal delay={0.1} y={20}>
          <div
            ref={ref}
            className={styles.fit}
            style={{ '--s': fitted ? scale : 1 } as CSSProperties}
            role="img"
            aria-label="You type “Black Friday. 30% off. Ends Sunday.” Plexo replies and sets up a sale page, an email and a reminder."
          >
            <div className={styles.panel}>
              {/* Dashed connectors, exported from Figma: this one under the cards, the other three over them. */}
              <img className={`${styles.connector} ${styles.toEmail}`} src={asset('connector-results.svg')} width={1} height={32} alt="" />

              {/* "Glass / You type" */}
              <div className={`${styles.glass} ${styles.you}`}>
                <div className={styles.youCard}>
                  <span className={styles.avatarSlot}>
                    <img className={styles.avatar} src={asset('avatar.webp')} width={43} height={43} alt="" />
                  </span>
                  <p className={styles.prompt}>Black Friday. 30% off. Ends Sunday.</p>
                </div>
                <span className={styles.cursor}>
                  <span className={styles.pointer}>
                    <img src={asset('navigation.svg')} width={20.7273} height={20.7273} alt="" />
                  </span>
                  <span className={styles.youTag}>You</span>
                </span>
              </div>

              {/* "Glass / Sol reply" */}
              <div className={`${styles.glass} ${styles.reply}`}>
                <div className={styles.replyCard}>
                  <span className={styles.logoTile}>
                    <img src={asset('plexo-mark.svg')} width={29.8121} height={31.5758} alt="" />
                  </span>
                  <span className={styles.replyLines}>
                    <i />
                    <i />
                  </span>
                </div>
              </div>

              {/* "Glass / Result 1–3" */}
              <div className={styles.results}>
                {/* Phones: the dashed line from Plexo's card branching down to each result. */}
                <span className={styles.branch} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                {results.map((r) => (
                  <div key={r.key} className={`${styles.glass} ${styles.result} ${styles[r.key]}`}>
                    <div className={styles.resultCard}>
                      <span className={styles.preview}>
                        <span className={styles.previewIcon}>
                          <img src={asset(`${r.icon.src}.svg`)} width={r.icon.w} height={r.icon.h} alt="" style={{ left: r.icon.x, top: r.icon.y }} />
                        </span>
                        {r.label}
                      </span>
                      <span className={styles.ready}>
                        <span className={styles.check}>
                          <img src={asset('check.svg')} width={7.174} height={7.174} alt="" />
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <img className={`${styles.connector} ${styles.toReply}`} src={asset('connector-reply.svg')} width={10} height={100.911} alt="" />
              <img className={`${styles.connector} ${styles.toPage}`} src={asset('connector-page.svg')} width={52.682} height={159.5} alt="" />
              <img className={`${styles.connector} ${styles.toReminder}`} src={asset('connector-reminder.svg')} width={63.182} height={162} alt="" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
