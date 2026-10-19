import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { softSpring, useStaticMotion } from '../lib/motion'
import styles from './SocialProof.module.css'

/**
 * Figma "Social proof" (575:15409): 1440×846, padding 80, white. Heading block, then story cards
 * (712×426, #f4f5f0, r40, gap 32) in a row the content column clips, so the second card peeks in at
 * the right. Each card: quote + "View Prompt" (Outline / Small, r8) and the author on the left (347);
 * the site's screenshot in a slanted, rounded shape on the right (365×426). Then "Start with a prompt"
 * and the carousel arrows (next, previous). The row scrolls sideways (swipe, trackpad or the arrows).
 *
 * Phones (the phone design still shows the previous card): the full screenshot on top, then the quote,
 * button and author.
 */
type Story = {
  quote: string
  name: string
  role: string
  avatar: string
  /** The screenshot cut to the card's slanted shape (desktop and tablet). */
  site: string
  /** The whole screenshot, for the stacked phone card. */
  siteWide: string
  siteAlt: string
}

// The design repeats the same story.
const stories: Story[] = Array.from({ length: 2 }, () => ({
  quote: 'With Plexo, I was able to bring my ideas to life and get my business online without all the stress.',
  name: 'Mrs. Olisa',
  role: 'Founder, Helimax',
  avatar: '/assets/v2/showcase-avatar-olisa.webp',
  site: '/assets/v2/showcase-helimax.webp',
  siteWide: '/assets/v2/showcase-helimax-wide.webp',
  siteAlt: 'The Helimax website, built with Plexo',
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
                <figcaption className={styles.content}>
                  <div className={styles.top}>
                    <blockquote className={styles.quote}>
                      <p>{story.quote}</p>
                    </blockquote>
                    <Button variant="outline" size="small" href="#top" className={styles.viewPrompt}>
                      View Prompt
                    </Button>
                  </div>
                  <span className={styles.author}>
                    <span className={styles.avatar}>
                      <img src={story.avatar} width={28} height={30} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className={styles.who}>
                      <span className={styles.name}>{story.name}</span>
                      <span className={styles.role}>{story.role}</span>
                    </span>
                  </span>
                </figcaption>
                <picture className={styles.site}>
                  <source media="(max-width: 767px)" srcSet={story.siteWide} width={800} height={431} />
                  <img src={story.site} width={365} height={426} alt={story.siteAlt} loading="lazy" decoding="async" />
                </picture>
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
