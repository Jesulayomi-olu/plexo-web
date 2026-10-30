'use client'

import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { Reveal } from '../../components/Reveal'
import { ease, useStaticMotion } from '../../lib/motion'
import type { Audience } from './audiences'
import styles from './MadeForWork.module.css'

/**
 * For You "Made for you" (571:12913 and siblings): "Made for your work." over five rows in a 940
 * column — icon (24 slot) · 32 · title (361.5 side) and the description (359) on the right, 1px
 * #d7d8d3 under each row. Heading to rows is 40, or 80 where `gap` says so (Founders, Coaches).
 *
 * Icons: each page has its own (Figma "Launch / rocket · Semibold" and siblings). Every artwork sits
 * in a 14.4px frame, centred in the 24px tile, at its exported size and offset (x, y) in that frame.
 */
const icons = {
  rocket: { w: 12.75, h: 12.7502, x: 0.975, y: 0.674 },
  'list-clock': { w: 12.45, h: 10.65, x: 1.274, y: 2.474 },
  tag: { w: 13.0471, h: 13.0471, x: 0.674, y: 0.674 },
  'file-chart-line': { w: 10.65, h: 13.05, x: 1.875, y: 0.675 },
  newspaper: { w: 13.05, h: 13.05, x: 0.675, y: 0.675 },
  magnet: { w: 14.4, h: 14.4, x: 0, y: 0 },
  funnel: { w: 14.4, h: 14.4, x: 0, y: 0 },
  'calendar-check': { w: 11.85, h: 12.45, x: 1.275, y: 0.674 },
  'credit-card': { w: 13.05, h: 9.45, x: 0.675, y: 2.474 },
  store: { w: 13.0527, h: 12.45, x: 0.675, y: 0.674 },
  'clipboard-list': { w: 10.65, h: 13.05, x: 1.875, y: 0.674 },
  globe: { w: 13.05, h: 13.05, x: 0.675, y: 0.675 },
  megaphone: { w: 11.85, h: 12.45, x: 1.275, y: 1.276 },
  'layout-panel-top': { w: 11.85, h: 11.85, x: 1.275, y: 1.275 },
  'layout-template': { w: 11.85, h: 11.85, x: 1.275, y: 1.275 },
  palette: { w: 13.05, h: 13.05, x: 0.675, y: 0.675 },
  'code-xml': { w: 14.4, h: 14.4, x: 0, y: 0 },
  'badge-check': { w: 13.0537, h: 13.049, x: 0.669, y: 0.677 },
}

export type WorkIcon = keyof typeof icons

export default function MadeForWork({ work, gap = 40 }: { work: Audience['work']; gap?: number }) {
  const isStatic = useStaticMotion()

  return (
    <section id="made-for-you" data-section="made-for-you" className={styles.section} aria-labelledby="work-title">
      <div className={`container ${styles.inner}`} style={{ '--work-gap': `${gap}px` } as CSSProperties}>
        <Reveal>
          <h2 id="work-title" className={styles.title}>
            Made for your work.
          </h2>
        </Reveal>
        <ul className={styles.rows}>
          {work.map((row, i) => {
            const icon = icons[row.icon]
            return (
              <motion.li
                key={row.title}
                className={styles.row}
                initial={isStatic ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease, delay: i * 0.05 }}
              >
                <h3 className={styles.rowTitle}>
                  <span className={styles.icon}>
                    <span className={styles.iconFrame}>
                      <img
                        src={`/assets/for-you/work/${row.icon}.svg`}
                        width={icon.w}
                        height={icon.h}
                        alt=""
                        style={{ left: icon.x, top: icon.y }}
                      />
                    </span>
                  </span>
                  {row.title}
                </h3>
                <p className={styles.rowBody}>{row.body}</p>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
