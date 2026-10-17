import { motion, useInView, useSpring } from 'framer-motion'
import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { useStaticMotion } from '../lib/motion'
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
 * Figma "AI" (532:24358): 1440×945, padding 80, #1d3509 with a 20% black overlay. Header (heading,
 * lead, "Start with a prompt"), then the 1280×508 panel: app mockup + three cards (458×133, gap 16).
 * Hidden check lists inside the cards are not rendered.
 */
const cards = [
  {
    title: 'Copy that sells',
    lines: ['Stop taking orders in DMs. ', 'Give buyers a proper place to shop and pay'],
    icon: prepareIcon(copyIcon),
    // Rotated "Frame" bounding box at (397, 67) inside the 458×133 card (clipped); SVG export is 71×101.
    illus: { w: 71, h: 101, top: 67 },
  },
  {
    title: 'On brand every time',
    lines: ['Keep your fonts, colours and ', 'visual style consistent.'],
    icon: prepareIcon(brandIcon),
    illus: { w: 70, h: 86, top: 69 },
  },
  {
    title: 'Hours back every week',
    // In Figma this title is 600 while the other two are 700.
    semibold: true,
    lines: ['Update your website with a ', 'simple instruction.'],
    icon: prepareIcon(hoursIcon),
    illus: { w: 70, h: 92, top: 67 },
  },
] as const

const CARD_WIDTH = 458
const ILLUS_LEFT = 397

/*
 * Motion: when the panel is half on screen, each card's icon draws itself line by line ("draw-on"),
 * one card after another, then floats gently; hovering a card tilts its icon toward the cursor.
 * Reduced motion / capture mode: the static Figma cards.
 */
const DRAW_STAGGER = 0.35
/** Maximum icon tilt toward the cursor, in degrees. */
const TILT = { x: 10, y: 14 }
const TILT_SPRING = { stiffness: 180, damping: 18, mass: 0.6 }
/** Gentle float once the icon has drawn: 6 px up and back on a slow ease-in-out loop. */
const FLOAT = { y: [0, -6, 0] }

type Card = (typeof cards)[number]

function AiCard({ card, index, drawing, animated }: { card: Card; index: number; drawing: boolean; animated: boolean }) {
  const rotateX = useSpring(0, TILT_SPRING)
  const rotateY = useSpring(0, TILT_SPRING)
  const delay = index * DRAW_STAGGER

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
    <div className={styles.card} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <h3 className={`${styles.title} ${'semibold' in card ? styles.titleSemibold : ''}`}>{card.title}</h3>
      <p className={styles.text}>
        {card.lines[0].trimEnd()}{' '}
        <br className={styles.desktopBreak} />
        {card.lines[1]}
      </p>
      <motion.div
        className={`${styles.illus} ${animated ? (drawing ? styles.illusDrawing : styles.illusPending) : ''}`}
        aria-hidden="true"
        style={
          {
            top: card.illus.top,
            right: CARD_WIDTH - ILLUS_LEFT - card.illus.w,
            width: card.illus.w,
            height: card.illus.h,
            rotateX,
            rotateY,
            '--delay': `${delay}s`,
          } as CSSProperties
        }
        initial={false}
        animate={animated && drawing ? FLOAT : undefined}
        transition={animated ? { duration: 3.6, ease: 'easeInOut', repeat: Infinity, delay: 1.4 + delay * 2 } : undefined}
        dangerouslySetInnerHTML={{ __html: card.icon }}
      />
    </div>
  )
}

export default function AiSection() {
  // The 1280×508 panel scales as one composition on narrower desktops, so it keeps the design's proportions.
  const { ref: panelRef, scale: panelScale } = useFitScale<HTMLDivElement>(1280)
  const isStatic = useStaticMotion()
  const cardsRef = useRef<HTMLUListElement>(null)
  const drawing = useInView(cardsRef, { once: true, amount: 0.5 })

  return (
    <section id="ai" data-section="ai" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.header}>
            <Reveal className={styles.intro}>
              <h2 className={styles.heading}>Plexo AI builds, so you can sell</h2>
              <p className={styles.lead}>
                {'Describe what you want, and Plexo AI helps turn it into a website.\n Spend less time building and more time growing your business.'}
              </p>
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
                <ul ref={cardsRef} className={styles.cards}>
                  {cards.map((card, i) => (
                    <li key={card.title}>
                      <AiCard card={card} index={i} drawing={drawing} animated={!isStatic} />
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
