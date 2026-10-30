'use client'

import { Fragment } from 'react'
import { Reveal } from '../../components/Reveal'
import styles from './StayInCharge.module.css'

/**
 * MCP and API "AI credits" (668:28232): white, padding 80, column gap 40: "You Stay In Charge" (40,
 * centred in a 420 box) over a 1280 row of three equal columns (padding 15/32, 1px #d7d8d3 dividers),
 * each a 20px icon and two lines of 16/24 (Figma's own line breaks).
 */
const points = [
  { icon: 'panels-top-left', lines: ['Every AI change shows ', 'up on your canvas'] },
  { icon: 'text-cursor-input', lines: ['Scoped API keys you ', 'can revoke anytime. '] },
  { icon: 'mail', lines: ['Your data stays isolated', ' per workspace. '] },
]

export default function StayInCharge() {
  return (
    <section id="control" data-section="control" className={styles.section} aria-labelledby="control-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.headSlot}>
          <h2 id="control-title" className={styles.title}>
            You Stay In Charge
          </h2>
        </Reveal>
        <ul className={styles.points}>
          {points.map((point, i) => (
            <Reveal key={point.icon} as="li" delay={0.06 * i} className={styles.point}>
              <img src={`/assets/features/mcp/${point.icon}.svg`} width={20} height={20} alt="" className={styles.icon} />
              <p className={styles.text}>
                {point.lines.map((line, j) => (
                  <Fragment key={j}>
                    {j > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
