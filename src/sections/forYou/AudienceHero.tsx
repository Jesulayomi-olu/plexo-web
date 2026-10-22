'use client'

import { motion } from 'framer-motion'
import { BlurIn } from '../../components/BlurIn'
import { PromptBox } from '../../components/PromptBox'
import { Reveal } from '../../components/Reveal'
import { ease, useStaticMotion } from '../../lib/motion'
import type { Audience } from './audiences'
import styles from './AudienceHero.module.css'

/**
 * For You "Hero" (571:12848 and siblings): white, padding 100/80, column gap 40, centred. The copy
 * (950 wide: tag pill · 64px title · lead), then a 1280×446 photo (r40, 2.35px blur) with the prompt
 * box (696×143) laid over it, 185 from the top.
 *
 * Motion: the copy comes into focus, the photo settles from a soft zoom, then the prompt box rises
 * and types its prompt.
 */
export default function AudienceHero({ hero }: { hero: Audience['hero'] }) {
  const isStatic = useStaticMotion()

  const photo = (
    <img
      src={hero.photo}
      width={1800}
      height={1200}
      alt=""
      className={styles.photo}
      style={{ objectPosition: hero.focus }}
      fetchPriority="high"
    />
  )

  return (
    <section id="top" data-section="audience-hero" className={styles.hero} aria-labelledby="audience-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <BlurIn blur={6} duration={1.1}>
            <p className={styles.tag}>{hero.tag}</p>
          </BlurIn>
          <BlurIn as="h1" delay={0.08} blur={14} duration={1.4} className={styles.title}>
            <span id="audience-title">{hero.title}</span>
          </BlurIn>
          <BlurIn as="p" delay={0.2} blur={8} duration={1.2} className={styles.lead}>
            {hero.lead}
          </BlurIn>
        </div>

        <div className={styles.stage}>
          {isStatic ? (
            <div className={styles.frame}>{photo}</div>
          ) : (
            <motion.div
              className={styles.frame}
              initial={{ opacity: 0, scale: 1.04, filter: 'blur(14px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(2.35px)' }}
              transition={{ duration: 1.4, ease, delay: 0.15 }}
            >
              {photo}
            </motion.div>
          )}
          {hero.tint && <div className={styles.tint} aria-hidden="true" />}
          <Reveal delay={0.55} y={24} className={styles.promptSlot}>
            <PromptBox variant="card" placeholder={hero.prompt} typingPrompts={[hero.prompt]} typingDelay={1100} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
