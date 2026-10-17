import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { softSpring, useStaticMotion } from '../lib/motion'
import styles from './SocialProof.module.css'

/**
 * Figma "Social proof" (532:24979): 1440×953, padding 80, white. Heading block, two testimonial
 * cards (624×533, gap 32; grey image placeholder, quote, author), then "Start with a prompt" and
 * the carousel arrows. The cards sit in a horizontal scroller (swipe on touch; the arrows move one
 * card). Figma shows "previous" disabled and "next" active; with only the two designed
 * testimonials there is nothing more to scroll to on desktop yet.
 */
type Story = { quote: string; name: string; role: string }

// The design repeats the same placeholder testimonial; image areas are grey placeholders.
const stories: Story[] = Array.from({ length: 2 }, () => ({
  quote: '“With Plexo, I was able to bring my ideas to life and get my business online without all the stress.”',
  name: 'Esther James',
  role: 'Founder, IJ studios',
}))

/* "Import icon" (191:2406 / 191:2394): 24px arrows, 2px stroke. */
function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === 'right' ? 'M5 12H19M12 19L19 12L12 5' : 'M19 12H5M12 19L5 12L12 5'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SocialProof() {
  const isStatic = useStaticMotion()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ scrollable: false, atStart: true, atEnd: false })

  const measure = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setState({ scrollable: max > 1, atStart: el.scrollLeft <= 1, atEnd: el.scrollLeft >= max - 1 })
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    el.addEventListener('scroll', measure, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', measure)
    }
  }, [measure])

  const step = (dir: 1 | -1) => {
    const el = scrollerRef.current
    const card = el?.querySelector<HTMLElement>('[data-slide]')
    if (!el || !card) return
    el.scrollBy({ left: dir * (card.offsetWidth + 32), behavior: isStatic ? 'auto' : 'smooth' })
  }

  const prevDisabled = !state.scrollable || state.atStart
  const nextDisabled = state.scrollable && state.atEnd

  return (
    <section id="showcase" data-section="showcase" className={styles.section} aria-labelledby="showcase-title">
      <div className="container">
        <Reveal className={styles.head}>
          <h2 id="showcase-title" className={`h2 ${styles.title}`}>
            Built with Plexo.
          </h2>
          <p className={styles.lead}>Real prompts. Real sites. Real businesses</p>
        </Reveal>

        <div
          ref={scrollerRef}
          className={styles.scroller}
          role="region"
          aria-roledescription="carousel"
          aria-label="Sites built with Plexo"
        >
          {stories.map((story, i) => (
            <Reveal key={i} delay={0.06 * i} className={styles.slide}>
              <motion.figure
                data-slide
                className={styles.card}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${stories.length}`}
                whileHover={isStatic ? undefined : { y: -3 }}
                transition={softSpring}
              >
                <div className={styles.preview} aria-hidden="true" />
                <figcaption className={styles.caption}>
                  <blockquote className={styles.quote}>
                    <p>{story.quote}</p>
                  </blockquote>
                  <span className={styles.author}>
                    <span className={styles.avatar} aria-hidden="true" />
                    <span className={styles.who}>
                      <span className={styles.name}>{story.name}</span>
                      <span className={styles.role}>{story.role}</span>
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12} className={styles.footer}>
          <Button variant="primary" href="#top">
            Start with a prompt
          </Button>
          <div className={styles.arrows}>
            <button
              type="button"
              className={`${styles.arrow} ${nextDisabled ? styles.arrowOff : ''}`}
              aria-label="Next"
              aria-disabled={nextDisabled || !state.scrollable}
              onClick={() => step(1)}
            >
              <Arrow dir="right" />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${prevDisabled ? styles.arrowOff : ''}`}
              aria-label="Previous"
              aria-disabled={prevDisabled}
              onClick={() => step(-1)}
            >
              <Arrow dir="left" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
