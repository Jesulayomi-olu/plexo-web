import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { focusEase, useStaticMotion } from '../lib/motion'
import { useFitScale } from '../lib/useFitScale'
import brandIcon from '../assets/ai-icons/brand.svg?raw'
import copyIcon from '../assets/ai-icons/copy.svg?raw'
import hoursIcon from '../assets/ai-icons/hours.svg?raw'
import styles from './AiSection.module.css'

/**
 * Inline the Figma vector icons so each line can draw itself: every path gets pathLength="1" (so
 * stroke-dasharray works in fractions) and an index for staggering.
 */
function prepareIcon(svg: string) {
  let k = 0
  return svg
    .replace(/<svg width="[^"]*" height="[^"]*"/, '<svg width="100%" height="100%" aria-hidden="true" focusable="false"')
    .replace(/<path /g, () => `<path pathLength="1" style="--k:${k++}" `)
}

/**
 * Figma "AI" (234:1014): 1440×960 on #1d3509 with a 20% black overlay.
 * Hidden "Bubble right" / "Chat bubble" and the hidden check lists inside the cards are not rendered.
 */
const cards = [
  {
    title: 'Copy that sells',
    // "Copy that sells" is 20/26 in Figma while the other two titles are 24/30.
    titleClass: styles.titleSmall,
    lines: ['Stop taking orders in DMs. ', 'Give buyers a proper place to shop and pay'],
    textTop: 25,
    icon: prepareIcon(copyIcon),
    // Rotated "Frame" bounding box at (397, 67) inside the 458×133 card (clipped); SVG export is 71×101.
    illus: { w: 71, h: 101, top: 67 },
  },
  {
    title: 'On brand every time',
    titleClass: styles.titleLarge,
    lines: ['Your fonts, colours and style,', 'remembered.'],
    textTop: 23,
    icon: prepareIcon(brandIcon),
    illus: { w: 70, h: 86, top: 69 },
  },
  {
    title: 'Hours back every week',
    titleClass: styles.titleLarge,
    lines: ['Updates that used to take a day ', 'take a sentence.'],
    textTop: 23,
    icon: prepareIcon(hoursIcon),
    illus: { w: 70, h: 92, top: 67 },
  },
] as const

const CARD_WIDTH = 458
const ILLUS_LEFT = 397

/*
 * Card rotator: one card at a time. Once the panel is on screen the cards take turns: each fades and
 * sharpens in, its icon draws itself line by line ("draw-on") and then floats gently, and after
 * SHOW_SECONDS the next card crossfades in, looping. Scroll safety net: on the first pass the card
 * shown never falls behind how far the visitor has scrolled through the panel, so all three are seen
 * even on a quick scroll. Hover or focus pauses the rotation; the progress bars show the timing and
 * switch cards on click. Hovering a card tilts its icon toward the cursor.
 * Reduced motion / capture mode: the three Figma cards, stacked and static.
 */
const SHOW_SECONDS = 3
/** Maximum icon tilt toward the cursor, in degrees. */
const TILT = { x: 10, y: 14 }
const TILT_SPRING = { stiffness: 180, damping: 18, mass: 0.6 }
/** Gentle float once the icon has drawn: 6 px up and back on a slow ease-in-out loop. */
const FLOAT = { y: [0, -6, 0] }
const FLOAT_TIMING = { duration: 3.6, ease: 'easeInOut', repeat: Infinity, delay: 1.1 } as const

type Card = (typeof cards)[number]

function AiCard({ card, animated }: { card: Card; animated: boolean }) {
  const rotateX = useSpring(0, TILT_SPRING)
  const rotateY = useSpring(0, TILT_SPRING)

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!animated || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - box.left) / box.width - 0.5
    const py = (event.clientY - box.top) / box.height - 0.5
    // Turn the icon's face toward the cursor.
    rotateY.set(px * 2 * TILT.y)
    rotateX.set(-py * 2 * TILT.x)
  }
  const onPointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div className={styles.card} style={{ paddingTop: card.textTop }} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <h3 className={card.titleClass}>{card.title}</h3>
      <p className={styles.text}>
        {card.lines[0].trimEnd()}{' '}
        <br className={styles.desktopBreak} />
        {card.lines[1]}
      </p>
      <motion.div
        className={`${styles.illus} ${animated ? styles.illusDrawing : ''}`}
        aria-hidden="true"
        style={{
          top: card.illus.top,
          right: CARD_WIDTH - ILLUS_LEFT - card.illus.w,
          width: card.illus.w,
          height: card.illus.h,
          rotateX,
          rotateY,
        }}
        initial={false}
        animate={animated ? FLOAT : undefined}
        transition={animated ? FLOAT_TIMING : undefined}
        dangerouslySetInnerHTML={{ __html: card.icon }}
      />
    </div>
  )
}

function CardRotator() {
  const ref = useRef<HTMLDivElement>(null)
  const started = useInView(ref, { once: true, amount: 0.5 })
  const inView = useInView(ref, { amount: 0.3 })
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const seen = useRef(new Set<number>())

  useEffect(() => {
    if (started) seen.current.add(index)
  }, [started, index])

  // Advance every SHOW_SECONDS while on screen and not paused (restarts whenever the card changes).
  useEffect(() => {
    if (!started || !inView || paused) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % cards.length), SHOW_SECONDS * 1000)
    return () => window.clearTimeout(id)
  }, [started, inView, paused, index])

  // Scroll safety net (first pass only): once the cards are past the middle of the screen and heading
  // off the top, keep pace with the scroll so all three are seen before they leave. Visitors who stop
  // with the panel in view get the timed rotation from the first card.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['center 45%', 'end 5%'] })
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (seen.current.size >= cards.length) return
    const floor = Math.min(cards.length - 1, Math.max(0, Math.floor(progress * cards.length)))
    setIndex((i) => (floor > i ? floor : i))
  })

  const card = cards[index]
  return (
    <div
      ref={ref}
      className={styles.rotator}
      style={{ '--show': `${SHOW_SECONDS}s` } as CSSProperties}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.rotatorStage} role="tabpanel" aria-label={card.title}>
        <AnimatePresence initial={false}>
          {started && (
            <motion.div
              key={card.title}
              className={styles.rotatorItem}
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: focusEase, delay: 0.15 } }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.35, ease: 'easeIn' } }}
            >
              <AiCard card={card} animated />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className={styles.progress} role="tablist" aria-label="What Plexo AI does">
        {cards.map((c, i) => {
          const state =
            i < index || (i === index && paused) ? styles.fillDone : i === index && started ? styles.fillRunning : ''
          return (
            <button
              key={c.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={c.title}
              className={styles.segment}
              onClick={() => setIndex(i)}
            >
              <span className={styles.track}>
                {/* Re-keyed so the fill restarts with each card. */}
                <span key={`${index}-${paused}`} className={`${styles.fill} ${state}`} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function AiSection() {
  // The 1280×508 panel scales as one composition on narrower desktops, so it keeps the design's proportions.
  const { ref: panelRef, scale: panelScale } = useFitScale<HTMLDivElement>(1280)
  const isStatic = useStaticMotion()

  return (
    <section id="ai" data-section="ai" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.header}>
            <Reveal className={styles.intro}>
              <h2 className={styles.heading}>Changed your mind? Just say so</h2>
              <p className={styles.lead}>Plexo AI writes, designs and rewrites, so you spend time selling, not building</p>
            </Reveal>
            <Reveal delay={0.06}>
              <Button variant="primary" href="#start">
                Start with a prompt
              </Button>
            </Reveal>
          </div>

          <div ref={panelRef} className={styles.panelFit} style={{ '--s': panelScale } as CSSProperties}>
            <div className={styles.panelScale}>
          <Reveal delay={0.12} className={styles.panel}>
            <div className={styles.app}>
              <img
                src="/assets/ai-app.webp"
                width={724}
                height={508}
                alt="Plexo AI assistant SOL with an empty new conversation: “Good morning, Esther!” above a prompt box reading “Ask SOL to publish a page…”."
                loading="lazy"
                decoding="async"
              />
            </div>
            {isStatic ? (
              <ul className={styles.cards}>
                {cards.map((card) => (
                  <li key={card.title}>
                    <AiCard card={card} animated={false} />
                  </li>
                ))}
              </ul>
            ) : (
              <CardRotator />
            )}
          </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
