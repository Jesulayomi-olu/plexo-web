import { motion } from 'framer-motion'
import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { softSpring, useStaticMotion } from '../lib/motion'
import styles from './SocialProof.module.css'

/**
 * Figma "Social proof" (234:2016). The testimonial row is wider than the column and bleeds
 * off the right edge (third card cut by the page edge at 1440). It is a native horizontal
 * scroller with snap points: touch/trackpad swipe, keyboard arrows when focused, and
 * click-and-drag with a mouse.
 */
type Story = {
  prompt: string
  quote: string
  name: string
}

// The design repeats the same placeholder story three times; image areas are grey placeholders.
const stories: Story[] = Array.from({ length: 3 }, () => ({
  prompt: '“Build a skincare store with product listings, prices, customer reviews and a checkout page”',
  quote: 'Plexo made launching my website effortless',
  name: 'Esther James',
}))

/** Mouse drag-to-scroll on top of native scrolling (touch and trackpads already scroll natively). */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean; id: number } | null>(null)

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false, id: e.pointerId }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current
    const d = drag.current
    if (!el || !d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true
      el.setPointerCapture(d.id)
      el.dataset.dragging = 'true'
    }
    if (d.moved) el.scrollLeft = d.left - dx
  }

  const end = () => {
    const el = ref.current
    const d = drag.current
    drag.current = null
    if (!el || !d?.moved) return
    if (el.hasPointerCapture(d.id)) el.releasePointerCapture(d.id)
    // Re-enabling snap lets the browser settle on the nearest card.
    delete el.dataset.dragging
  }

  return { ref, onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end }
}

export default function SocialProof() {
  const isStatic = useStaticMotion()
  const { ref, ...dragHandlers } = useDragScroll()

  return (
    <section
      id="built-with-plexo"
      data-section="built-with-plexo"
      className={styles.section}
      aria-labelledby="built-with-plexo-title"
    >
      <div className={`container ${styles.head}`}>
        <Reveal>
          <h2 id="built-with-plexo-title" className={`h2 ${styles.title}`}>
            Built with Plexo.
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className={styles.lead}>Real prompts. Real sites. Real businesses</p>
        </Reveal>
      </div>

      <div
        ref={ref}
        className={styles.scroller}
        role="region"
        aria-roledescription="carousel"
        aria-label="Sites built with Plexo"
        tabIndex={0}
        {...dragHandlers}
      >
        <div className={styles.track}>
          {stories.map((story, i) => (
            <div
              key={i}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${stories.length}`}
            >
              <Reveal delay={0.06 * i} className={styles.slideInner}>
                <motion.figure
                  className={styles.card}
                  whileHover={isStatic ? undefined : { y: -3 }}
                  transition={softSpring}
                >
                  <blockquote className={styles.prompt}>
                    <p>{story.prompt}</p>
                  </blockquote>
                  <div className={styles.preview} aria-hidden="true" />
                  <figcaption className={styles.caption}>
                    <p className={styles.quote}>{story.quote}</p>
                    <span className={styles.author}>
                      <span className={styles.avatar} aria-hidden="true" />
                      <span className={styles.name}>{story.name}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      <Reveal delay={0.12} className={styles.cta}>
        <Button variant="primary" href="#top">
          Start with a prompt
        </Button>
      </Reveal>
    </section>
  )
}
