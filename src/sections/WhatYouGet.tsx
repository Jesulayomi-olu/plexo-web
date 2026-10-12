import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Reveal } from '../components/Reveal'
import { isPreviewMode, softSpring, useStaticMotion } from '../lib/motion'
import { DrawIcon } from '../motion/DrawIcon'
import { prepareDrawableSvg } from '../motion/svg'
import chartIcon from '../assets/motion/wyg-chart.svg?raw'
import globeIcon from '../assets/motion/wyg-globe.svg?raw'
import panelTopIcon from '../assets/motion/wyg-panel-top.svg?raw'
import shoppingBagIcon from '../assets/motion/wyg-shopping-bag.svg?raw'

/** Inline icons for the preview's draw-on (same Figma exports as the <img> versions). */
const drawable: Record<string, string> = {
  '/assets/icons/wyg-panel-top.svg': prepareDrawableSvg(panelTopIcon),
  '/assets/icons/wyg-shopping-bag.svg': prepareDrawableSvg(shoppingBagIcon),
  '/assets/icons/wyg-chart.svg': prepareDrawableSvg(chartIcon),
  '/assets/icons/wyg-globe.svg': prepareDrawableSvg(globeIcon),
}

/**
 * Preview: when the cards are on screen, each round badge pops in (spring) and then its icon draws
 * itself line by line, one card after another.
 */
function DrawnBadge({ icon, index, play }: { icon: string; index: number; play: boolean }) {
  return (
    <motion.span
      className={styles.badge}
      aria-hidden="true"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={play ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 360, damping: 22, delay: 0.15 + index * 0.12 }}
    >
      <DrawIcon svg={drawable[icon]} play={play} delay={0.35 + index * 0.12} duration={0.9} className={styles.icon} />
    </motion.span>
  )
}
import styles from './WhatYouGet.module.css'

/** Figma "What you get" (234:943): heading + four benefit cards with round icon badges. */
const benefits = [
  {
    title: 'Launch faster',
    body: 'Site, funnel, email, store, blog. That adds up fast',
    icon: '/assets/icons/wyg-panel-top.svg',
    textWidth: styles.text250,
  },
  {
    title: 'Sell more',
    body: 'Pages and funnels designed to turn visitors into buyers.',
    icon: '/assets/icons/wyg-shopping-bag.svg',
    textWidth: styles.text250,
  },
  {
    title: 'Spend less',
    body: 'One subscription replaces your site builder, funnel tool and email designer.',
    icon: '/assets/icons/wyg-chart.svg',
    textWidth: styles.text270,
  },
  {
    title: 'Look established',
    body: 'A professional brand on your own domain from day one.',
    icon: '/assets/icons/wyg-globe.svg',
    textWidth: styles.text270,
  },
] as const

export default function WhatYouGet() {
  const isStatic = useStaticMotion()
  const drawBadges = isPreviewMode && !isStatic
  const listRef = useRef<HTMLUListElement>(null)
  const listInView = useInView(listRef, { once: true, amount: 0.4 })

  return (
    <section id="benefits" data-section="benefits" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <Reveal>
            <h2 className={styles.heading}>Built to grow your business.</h2>
          </Reveal>

          <ul ref={listRef} className={styles.cards}>
            {benefits.map((b, i) => (
              <Reveal key={b.title} as="li" delay={0.06 * (i + 1)} className={styles.cardItem}>
                <motion.article
                  className={styles.card}
                  whileHover={isStatic ? undefined : { y: -3 }}
                  transition={softSpring}
                >
                  {drawBadges ? (
                    <DrawnBadge icon={b.icon} index={i} play={listInView} />
                  ) : (
                    <span className={styles.badge} aria-hidden="true">
                      <img src={b.icon} alt="" width={19} height={19} className={styles.icon} />
                    </span>
                  )}
                  <div className={`${styles.text} ${b.textWidth}`}>
                    <h3 className={styles.title}>{b.title}</h3>
                    <p className={styles.body}>{b.body}</p>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
