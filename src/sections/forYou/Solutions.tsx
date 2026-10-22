'use client'

import { motion, type Variants } from 'framer-motion'
import { Reveal } from '../../components/Reveal'
import { ease, useStaticMotion } from '../../lib/motion'
import styles from './Solutions.module.css'

/**
 * For You "Solutions" (571:12881 and siblings): "We built Plexo for this." over two 345-tall cards,
 * gap 40, in a 1018 column — "The problem" (#f5f7ed, minus bullets) and "How Plexo fixes it"
 * (#1d3509, double-check bullets). Each card's content is a centred 324 column.
 *
 * Motion: the cards slide in towards each other; their lines follow one by one.
 */
const list: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
}

const item: Variants = {
  hidden: { opacity: 0, x: -10 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.45, ease } },
}

function Card({
  tone,
  title,
  icon,
  iconSize,
  bullet,
  lines,
}: {
  tone: 'problem' | 'fix'
  title: string
  icon: string
  iconSize: number
  bullet: string
  lines: string[]
}) {
  const isStatic = useStaticMotion()
  const motionList = isStatic ? {} : { variants: list, initial: 'hidden', whileInView: 'shown', viewport: { once: true, amount: 0.4 } }
  const motionItem = isStatic ? {} : { variants: item }

  return (
    <div className={`${styles.card} ${tone === 'fix' ? styles.fix : styles.problem}`}>
      <div className={styles.column}>
        <h3 className={styles.cardTitle}>
          <span className={styles.icon}>
            <img src={icon} width={iconSize} height={iconSize} alt="" />
          </span>
          {title}
        </h3>
        <motion.ul className={styles.lines} {...motionList}>
          {lines.map((line, i) => (
            <motion.li key={i} className={styles.line} {...motionItem}>
              <img src={bullet} width={24} height={24} alt="" className={styles.bullet} />
              <span>{line}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}

export default function Solutions({ problems, fixes }: { problems: string[]; fixes: string[] }) {
  return (
    <section id="solutions" data-section="solutions" className={styles.section} aria-labelledby="solutions-title">
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <h2 id="solutions-title" className={styles.title}>
            We built Plexo for this.
          </h2>
        </Reveal>
        <div className={styles.cards}>
          <Reveal y={0} delay={0.05} className={styles.slotStart}>
            <Card
              tone="problem"
              title="The problem"
              icon="/assets/for-you/face-frown.svg"
              iconSize={22}
              bullet="/assets/for-you/minus.svg"
              lines={problems}
            />
          </Reveal>
          <Reveal y={0} delay={0.12} className={styles.slotEnd}>
            <Card
              tone="fix"
              title="How Plexo fixes it"
              icon="/assets/for-you/sparkles.svg"
              iconSize={22.0048}
              bullet="/assets/for-you/check-check.svg"
              lines={fixes}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
