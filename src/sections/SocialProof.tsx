'use client'

import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { softSpring, useStaticMotion } from '../lib/motion'
import { PromptModal } from './PromptModal'
import styles from './SocialProof.module.css'

/**
 * Figma "Social proof" (575:15409): 1440×846, padding 80, white. Heading block, then story cards
 * (712×426, #f4f5f0, r40, gap 32) in a row the content column clips, so the second card peeks in at
 * the right. Each card: quote + "View Prompt" (Outline / Small, r8) and the author on the left (347);
 * the site's screenshot in a slanted, rounded shape on the right (365×426). Then "Start with a prompt"
 * and the carousel arrows (next, previous). The row scrolls sideways (swipe, trackpad or the arrows).
 * "View Prompt" opens the prompt dialog over its card (see PromptModal); it is hidden otherwise.
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
  /** The prompt the site was built from, shown by "View Prompt". */
  prompt: string
}

// The design repeats the same story.
export const stories: Story[] = Array.from({ length: 2 }, () => ({
  prompt:
    'Create a welcoming website for Helimax, an agricultural business. Use lush farm photography, fresh produce imagery, green accents and a clean, modern layout. Include a strong hero, an overview of our operations, consultation services, a product shop, an FAQ and contact details. Make it easy for visitors to explore our produce, learn about our services and get in touch. Ensure the website is responsive and accessible.',
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

/**
 * One story card: quote, "View Prompt" and author on the left, the site's screenshot on the right.
 * `label` makes it a carousel slide ("1 of 2"); without it the card stands alone.
 */
export function StoryCard({
  story,
  label,
  open,
  onShowPrompt,
  onClosePrompt,
}: {
  story: Story
  label?: string
  open: boolean
  onShowPrompt: () => void
  onClosePrompt: () => void
}) {
  const isStatic = useStaticMotion()

  return (
    <motion.figure
      data-slide
      className={styles.card}
      aria-roledescription={label ? 'slide' : undefined}
      aria-label={label}
      whileHover={isStatic || open ? undefined : { y: -3 }}
      transition={softSpring}
    >
      <figcaption className={styles.content}>
        <div className={styles.top}>
          <blockquote className={styles.quote}>
            <p>{story.quote}</p>
          </blockquote>
          <Button
            variant="outline"
            size="small"
            className={styles.viewPrompt}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={onShowPrompt}
          >
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
      <PromptModal open={open} prompt={story.prompt} onClose={onClosePrompt} />
    </motion.figure>
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

  // Which card's prompt dialog is open (none until "View Prompt" is pressed). A card that only peeks
  // in is scrolled fully into view first.
  const [openPrompt, setOpenPrompt] = useState<number | null>(null)
  const closePrompt = useCallback(() => setOpenPrompt(null), [])
  const showPrompt = (index: number) => {
    const card = scrollerRef.current?.querySelectorAll<HTMLElement>('[data-slide]')[index]
    card?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: isStatic ? 'auto' : 'smooth' })
    setOpenPrompt(index)
  }

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
              <StoryCard
                story={story}
                label={`${i + 1} of ${stories.length}`}
                open={openPrompt === i}
                onShowPrompt={() => showPrompt(i)}
                onClosePrompt={closePrompt}
              />
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
