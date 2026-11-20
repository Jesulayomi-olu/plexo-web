'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { durations, ease, focusEase, useStaticMotion } from '../../lib/motion'
import styles from './AuthPanel.module.css'

const ASSETS = '/assets/auth'

/**
 * The quotes of Figma "Component 11" (component set 1227:9582), in variant order. Full stop added to the
 * first quote. The second founder's business is PAR Nursing Hub, as in the home page stories (this Figma
 * component says "PAR Nursing Home").
 */
const quotes = [
  {
    text: 'Being able to publish HTML straight from Claude has transformed our workflow. We can launch faster, test and iterate without slowing down.',
    name: 'Ebitimi Jumbo',
    role: 'Founder, MeerHQ',
    avatar: `${ASSETS}/avatar-ebitimi.webp`,
    height: 28,
  },
  {
    text: 'Plexo made it easy to create a beautiful, functional website without any coding experience.',
    name: 'Rukky',
    role: 'Founder, PAR Nursing Hub',
    avatar: `${ASSETS}/avatar-rukky.webp`,
    height: 30,
  },
]

function Arrow({ dir, disabled, onClick }: { dir: 'prev' | 'next'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={styles.arrow}
      aria-label={dir === 'prev' ? 'Previous quote' : 'Next quote'}
      aria-disabled={disabled}
      onClick={() => !disabled && onClick()}
    >
      <img className={`${styles.arrowIcon} ${styles.iconOn}`} src={`${ASSETS}/arrow-${dir}.svg`} width={16} height={16} alt="" />
      <img className={`${styles.arrowIcon} ${styles.iconOff}`} src={`${ASSETS}/arrow-${dir}-off.svg`} width={16} height={16} alt="" />
    </button>
  )
}

/**
 * The auth screens' green panel (Figma 1296:8211): logo (back to the home page), tagline and the
 * customer quotes, which the arrows step through. Below 1024 only the logo shows, as a band.
 */
export default function AuthPanel() {
  const isStatic = useStaticMotion()
  const [index, setIndex] = useState(0)
  const quote = quotes[index]

  const swap = isStatic
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: durations.base, ease },
      }

  return (
    <div className={styles.panel}>
      <img className={styles.art} src={`${ASSETS}/panel-lines.webp`} width={946} height={1261} alt="" />
      <div className={styles.content}>
        <div className={styles.brand}>
          <a href="/" className={styles.logo} aria-label="Plexo home">
            {/* 24 tall, the nav's size (the design team asked for it smaller than Figma's 40). */}
            <img className={styles.logoLight} src="/assets/v2/icons/logo-light.svg" width={92.44} height={24} alt="" />
            {/* Below 1024 the panel is gone: just the site's dark logo, 24 tall, at the page edge. */}
            <img className={styles.logoCompact} src="/assets/v2/icons/logo-dark.svg" width={93} height={24} alt="" />
          </a>
          {/* Blur-to-focus like the site's BlurIn, but hydration-safe for reduced motion: the same starting
              state on server and client, reached at once when static. */}
          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0.06, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            transition={
              isStatic
                ? { duration: 0 }
                : { filter: { duration: 1.2, ease: focusEase, delay: 0.1 }, opacity: { duration: 0.84, ease: focusEase, delay: 0.1 } }
            }
          >
            Everything you need to put your business online, without the hassle
          </motion.p>
        </div>

        <motion.figure
          className={styles.testimonial}
          aria-roledescription="carousel"
          aria-label="What customers say"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={isStatic ? { duration: 0 } : { duration: durations.slow, ease, delay: 0.35 }}
        >
          <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.blockquote key={index} className={styles.quote} {...swap}>
                <p>{quote.text}</p>
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <div className={styles.row}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={index} className={styles.author} {...swap}>
                <img className={styles.avatar} src={quote.avatar} width={28} height={quote.height} alt="" />
                <span className={styles.who}>
                  <span className={styles.name}>{quote.name}</span>
                  <span className={styles.role}>{quote.role}</span>
                </span>
              </motion.div>
            </AnimatePresence>
            <div className={styles.arrows}>
              <Arrow dir="prev" disabled={index === 0} onClick={() => setIndex(index - 1)} />
              <Arrow dir="next" disabled={index === quotes.length - 1} onClick={() => setIndex(index + 1)} />
            </div>
          </div>
        </motion.figure>
      </div>
    </div>
  )
}
