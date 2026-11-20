'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { useStaticMotion } from '../../lib/motion'
import { SIGNUP_HREF } from '../navData'
import styles from './Stories.module.css'

/**
 * Figma "Social proof" (1166:15988) in Home page V2 (1166:14994): 1440×923, padding 80, white.
 * "Frame 16" (149): heading (40/46 semibold, an 804 box left-aligned inside the centred 888 column) · 16 ·
 * lead (16/24, #333332, centred) · 24 · "Get Started" (Button / Medium, 112×40). Then, 64 below, the
 * story card, an instance (1221:8098) of "Component 10", whose two variants are the two stories
 * (MeerHQ 1204:10903, PAR Nursing Hub 1204:10904): 1280×471, #f4f5f0, right corners r40 (the left
 * ones square); the quote and author on the left (a 468×394 column, padding 0/24, centred vertically,
 * placed 2.5px left of the card) and the site's screenshot on the right (785×471, right corners r40).
 * 39 below the card, the previous / next arrows ("Icon accent", 40×40, #f4f5f0, r40, gap 24) sit at
 * the right.
 * Hidden in Figma and not rendered: the earlier Helimax card and "Frame 22" inside each variant.
 *
 * The stories form a carousel (a sideways scroller, one card per view): the arrows move one story,
 * touch and trackpads swipe. An arrow greys out when there is no story that way, as Figma draws
 * "previous" on the first story.
 *
 * The screenshot always shows whole (it scales, never crops); below 1200px the card stacks: the
 * screenshot on top, then the quote and author.
 */
type Story = {
  /** Paragraphs of the quote. */
  quote: string[]
  name: string
  role: string
  avatar: string
  /** The site's screenshot: 2× (1570×942) and a smaller copy for phones. */
  site: string
  siteSmall: string
  siteAlt: string
}

export const stories: Story[] = [
  {
    quote: [
      'At MeerHQ, we run marketing and sales campaigns for digital and physical products and brands. We needed a simple way to host campaigns, whether we were testing ideas or launching them live.',
      'As an AI-powered team, being able to take an HTML file straight from Claude and host it quickly with Plexo has been a game changer. It helps us get campaigns out faster, test ideas and iterate without slowing down our workflow.',
    ],
    name: 'Ebitimi Jumbo',
    role: 'Founder, MeerHQ',
    avatar: '/assets/v3/stories/meerhq-avatar.webp',
    site: '/assets/v3/stories/meerhq-site.webp',
    siteSmall: '/assets/v3/stories/meerhq-site-800.webp',
    siteAlt: 'The MeerHQ campaign page "Turn your ideas into AI-powered videos", hosted on Plexo',
  },
  {
    // Figma's copy (1204:10854) with its closing full stops added; the business is PAR Nursing Hub (Figma
    // says Pioneer Care Home), both per the design team.
    quote: [
      "Plexo has made creating a beautiful, functional website possible, even without coding experience. I'm so happy with how my website turned out and I wholeheartedly recommend Plexo to anyone looking to bring their ideas to life.",
      'I love how intuitive and easy the platform is to use, alongside the incredible support from the team.',
    ],
    name: 'Rukky',
    role: 'Founder, PAR Nursing Hub',
    avatar: '/assets/v3/stories/rukky-avatar.webp',
    site: '/assets/v3/stories/rukky-site.webp',
    siteSmall: '/assets/v3/stories/rukky-site-800.webp',
    siteAlt: 'The PAR Nursing Hub home page "You don’t have to navigate nursing alone.", hosted on Plexo',
  },
]

/** The gap between story cards in the scroller (kept in step with `.scroller` in the CSS). */
const SLIDE_GAP = 32

function StoryCard({ story, label }: { story: Story; label: string }) {
  return (
    <figure data-slide className={styles.card} aria-roledescription="slide" aria-label={label}>
      <figcaption className={styles.content}>
        <blockquote className={styles.quote}>
          {story.quote.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </blockquote>
        <span className={styles.author}>
          <img className={styles.avatar} src={story.avatar} width={40} height={40} alt="" loading="lazy" decoding="async" />
          <span className={styles.who}>
            <span className={styles.name}>{story.name}</span>
            <span className={styles.role}>{story.role}</span>
          </span>
        </span>
      </figcaption>
      <div className={styles.site}>
        <img
          src={story.site}
          srcSet={`${story.siteSmall} 800w, ${story.site} 1570w`}
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) calc(100vw - 80px), 785px"
          width={785}
          height={471}
          alt={story.siteAlt}
          loading="lazy"
          decoding="async"
        />
      </div>
    </figure>
  )
}

export default function Stories() {
  const isStatic = useStaticMotion()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ scrollable: false, atStart: true, atEnd: true })

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
    el.scrollBy({ left: dir * (card.offsetWidth + SLIDE_GAP), behavior: isStatic ? 'auto' : 'smooth' })
  }

  const prevDisabled = !state.scrollable || state.atStart
  const nextDisabled = !state.scrollable || state.atEnd
  // Figma draws "next" dark while there is only one story; it greys out once a real end is reached.
  const nextLooksOff = state.scrollable && state.atEnd

  return (
    <section id="stories" data-section="stories" className={styles.section} aria-labelledby="stories-title">
      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.copy}>
            <h2 id="stories-title" className={styles.title}>
              See what people are building with Plexo
            </h2>
            <p className={styles.lead}>Websites built. Businesses launched.</p>
          </div>
          <Button href={SIGNUP_HREF}>Get Started</Button>
        </Reveal>

        {/* The carousel fades up as a whole, so a story scrolled in later is already in place. */}
        <Reveal className={styles.scrollerWrap}>
          <div
            ref={scrollerRef}
            className={styles.scroller}
            role="region"
            aria-roledescription="carousel"
            aria-label="Customer stories"
          >
            {stories.map((story, i) => (
              <div key={story.name} className={styles.slide}>
                <StoryCard story={story} label={`${i + 1} of ${stories.length}`} />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className={styles.controls}>
          <button
            type="button"
            className={`${styles.arrow} ${prevDisabled ? styles.arrowOff : ''}`}
            aria-label="Previous story"
            aria-disabled={prevDisabled}
            onClick={() => !prevDisabled && step(-1)}
          >
            <span className={`${styles.arrowIcon} ${styles.arrowPrev}`} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${nextLooksOff ? styles.arrowOff : ''}`}
            aria-label="Next story"
            aria-disabled={nextDisabled}
            onClick={() => !nextDisabled && step(1)}
          >
            <span className={`${styles.arrowIcon} ${styles.arrowNext}`} aria-hidden="true" />
          </button>
        </Reveal>
      </div>
    </section>
  )
}
