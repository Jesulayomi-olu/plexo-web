'use client'

import { motion } from 'framer-motion'
import { Reveal } from '../../components/Reveal'
import { ease, useStaticMotion } from '../../lib/motion'
import type { Audience } from './audiences'
import styles from './MadeForWork.module.css'

/**
 * For You "Made for you" (571:12913 and siblings): "Made for your work." over five rows in a 940
 * column — icon (24 slot) · 32 · title (361.5 side) and the description (359) on the right, 1px
 * #d7d8d3 under each row. The icons are the same five on every page; their artwork sizes differ
 * inside the 14.4px icon frame, so each keeps its exported size.
 */
const icons = [
  { src: '/assets/for-you/work-1.svg', w: 13.2, h: 13.2 },
  { src: '/assets/for-you/work-2.svg', w: 14.4, h: 14.4 },
  { src: '/assets/for-you/work-3.svg', w: 10.8, h: 13.2 },
  { src: '/assets/for-you/work-4.svg', w: 10.8, h: 13.2 },
  { src: '/assets/for-you/work-5.svg', w: 13.2, h: 13.2 },
]

export default function MadeForWork({ work }: { work: Audience['work'] }) {
  const isStatic = useStaticMotion()

  return (
    <section id="made-for-you" data-section="made-for-you" className={styles.section} aria-labelledby="work-title">
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <h2 id="work-title" className={styles.title}>
            Made for your work.
          </h2>
        </Reveal>
        <ul className={styles.rows}>
          {work.map((row, i) => {
            const icon = icons[i % icons.length]
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
                    <img src={icon.src} width={icon.w} height={icon.h} alt="" />
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
