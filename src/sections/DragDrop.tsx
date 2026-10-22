'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { ease, usePreviewMode, useStaticMotion } from '../lib/motion'
import styles from './DragDrop.module.css'

/**
 * Figma "Drag and drop" (Home page V2 532:24562) with the expandable cards from "Component 3" (238:1683).
 * Variants: Frame 2147239068 (live expanded, default page instance) / Frame 26 (blocks expanded) /
 * Frame 2147239067 (mix expanded).
 *
 * Per Figma, the first collapsed card (in DOM order) is a flat #f0f6df panel (260×391, no radius,
 * no border) and the second one a #f5f7ed card with a 1px #e2e1e1 border and r12 (260×395).
 * Illustration positions below are Figma's per-variant positions, converted to the card's padding
 * box (Figma x/y − 1px border).
 */

type CardId = 'live' | 'blocks' | 'mix'
type Kind = 'expanded' | 'tint' | 'cream'

// Titles are bulleted list items in Figma. `copyTop`: the text block's y in the expanded card (Figma − 1px border).
const cards: { id: CardId; title: string; text: string; copyTop: number }[] = [
  { id: 'live', title: 'See what goes live', text: 'Design your page visually and preview it across desktop and mobile.', copyTop: 144.5 },
  {
    id: 'blocks',
    title: 'Start with ready made blocks',
    text: 'Add hero sections, pricing, testimonials, forms and checkout sections.',
    copyTop: 132,
  },
  {
    id: 'mix',
    title: 'Combine AI with your creativity',
    text: 'Generate a starting point with AI, then customise every detail yourself.',
    copyTop: 132,
  },
]

/*
 * Expanded card: the #f0f6df panel starts at 308/696 of the card; illustrations sit 64px into the
 * 388px panel (x=372), i.e. centred-ish in the panel: left = 0.7212645 × (card width) − 130px,
 * expressed in the padding box (width P = card − 2px): 72.12645% − 129.5575px.
 */
const EXPANDED_LEFT = 'calc(72.12645% - 129.5575px)'
const EXPANDED_LEFT_MIX = 'calc(72.12645% - 130.8575px)' // mix export starts 1.3px left of its node (shadow)
const EXPANDED_TOP = 97

type Pos = { left: number | string; top: number; hidePhone?: boolean }

function illusPosition(id: CardId, kind: Kind, active: number): Pos {
  if (id === 'live') {
    if (kind === 'expanded') return { left: EXPANDED_LEFT, top: EXPANDED_TOP }
    // Frame 2147239067 (mix expanded) shows the desktop window only, at (0,95).
    if (active === 2) return { left: -1, top: 83, hidePhone: true }
    return { left: -1, top: 94 } // Frame 26: full illustration at (0,95)
  }
  if (id === 'blocks') {
    if (kind === 'expanded') return { left: EXPANDED_LEFT, top: EXPANDED_TOP }
    if (kind === 'tint') return { left: -1, top: 83 } // ABS in the row at (728,86), not clipped by the card
    return { left: -0.5, top: 82 } // (0.5,83)
  }
  if (kind === 'expanded') return { left: EXPANDED_LEFT_MIX, top: EXPANDED_TOP }
  return { left: -3.3, top: 69 } // (-1,70) minus the 1.3px shadow offset of the export
}

function kindFor(index: number, active: number): Kind {
  if (index === active) return 'expanded'
  const firstCollapsed = active === 0 ? 1 : 0
  return index === firstCollapsed ? 'tint' : 'cream'
}

const cardColors: Record<Kind, { backgroundColor: string; borderColor: string; borderRadius: number }> = {
  expanded: { backgroundColor: '#ffffff', borderColor: '#d7d8d3', borderRadius: 12 },
  tint: { backgroundColor: '#f0f6df', borderColor: '#f0f6df', borderRadius: 0 },
  cream: { backgroundColor: '#f5f7ed', borderColor: '#e2e1e1', borderRadius: 12 },
}

function useMinWidth(px: number) {
  const query = `(min-width: ${px}px)`
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => true,
  )
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12a.75.75 0 0 1-.75.75h-7.5v7.5a.75.75 0 1 1-1.5 0v-7.5h-7.5a.75.75 0 1 1 0-1.5h7.5v-7.5a.75.75 0 1 1 1.5 0v7.5h7.5A.75.75 0 0 1 21 12Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Illustration artwork (2× WebP exports, rendered at 1×). */
/**
 * Preview: the blocks list with the "Testimonials" chip as its own layer (Figma 238:1764 + 238:1823).
 * Each time the card expands, the chip settles into its slot in the list, then lifts back out into
 * the dragged position (spring, shadow growing, a slight tilt that straightens) — a quick pick-up.
 * At rest it is exactly the Figma dragging state.
 */
function BlocksPickUp({ expanded }: { expanded: boolean }) {
  // From the dragging position (26, 85.62) to resting in the drop-zone row (1, 93).
  const rest = { x: -25, y: 7.38 }
  return (
    <span className={styles.artBlocks}>
      <img className={styles.blocksList} src="/assets/dnd-blocks-list.webp" width={260} height={230} alt="" />
      <motion.img
        className={styles.blocksChip}
        src="/assets/dnd-chip-testimonials.webp"
        width={241.49}
        height={55.35}
        alt=""
        initial={false}
        animate={
          expanded
            ? {
                x: [0, rest.x, rest.x, 0],
                y: [0, rest.y, rest.y, 0],
                rotate: [0, 0, -1.6, 0],
                scale: [1, 0.98, 1.03, 1],
                boxShadow: [
                  '0 12px 26px rgb(28 54 10 / 0.14)',
                  '0 1px 2px rgb(28 54 10 / 0.04)',
                  '0 18px 34px rgb(28 54 10 / 0.18)',
                  '0 12px 26px rgb(28 54 10 / 0.14)',
                ],
              }
            : { x: 0, y: 0, rotate: 0, scale: 1, boxShadow: '0 12px 26px rgb(28 54 10 / 0.14)' }
        }
        transition={expanded ? { duration: 1.1, times: [0, 0.3, 0.62, 1], ease: [0.33, 1, 0.68, 1], delay: 0.25 } : { duration: 0.3 }}
      />
    </span>
  )
}

function Artwork({
  id,
  hidePhone = false,
  isStatic = false,
  expanded = false,
}: {
  id: CardId
  hidePhone?: boolean
  isStatic?: boolean
  expanded?: boolean
}) {
  const isPreviewMode = usePreviewMode()
  if (id === 'live') {
    // Frame 2147239069: desktop window (260×201 at y=11) + phone (110×233 at x=151).
    return (
      <span className={styles.artLive}>
        <img className={styles.liveBrowser} src="/assets/dnd-live-browser.webp" width={260} height={201} alt="" />
        <motion.img
          className={styles.livePhone}
          src="/assets/dnd-live-phone.webp"
          width={110}
          height={233}
          alt=""
          initial={false}
          animate={{ opacity: hidePhone ? 0 : 1 }}
          transition={isStatic ? { duration: 0 } : { duration: 0.3, ease }}
        />
      </span>
    )
  }
  if (id === 'blocks') {
    if (isPreviewMode && !isStatic) return <BlocksPickUp expanded={expanded} />
    return <img className={styles.artImg} src="/assets/dnd-blocks-full.webp" width={293.5} height={230} alt="" />
  }
  return <img className={styles.artImg} src="/assets/dnd-mix-full.webp" width={293} height={256} alt="" />
}

export default function DragDrop() {
  const isDesktop = useMinWidth(1200)

  return (
    <section id="canvas" data-section="canvas" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.main}>
            <Reveal className={styles.intro}>
              <h2 className={`h2 ${styles.heading}`}>Prefer to build it yourself? Go for it.</h2>
              <p className={`lead ${styles.lead}`}>
                Take control with a visual editor that lets you design your website exactly how you want it. No code. No
                guesswork.
              </p>
            </Reveal>
            <Reveal delay={0.06}>{isDesktop ? <CardRow /> : <CardStack />}</Reveal>
          </div>
          <Reveal delay={0.12}>
            <Button variant="secondary" href="#start">
              Open the canvas
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Desktop (≥1200): one expanded card, two collapsed; hover / focus / click expands. */
function CardRow() {
  const [active, setActive] = useState(0)
  const isStatic = useStaticMotion()
  const uid = useId()
  const hoverTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(hoverTimer.current), [])

  const layoutTransition = isStatic ? { duration: 0 } : { duration: 0.55, ease }
  const fadeIn = isStatic ? { duration: 0 } : { duration: 0.3, ease, delay: 0.32 }
  const fadeOut = isStatic ? { duration: 0 } : { duration: 0.12, ease }

  const queue = (i: number) => {
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => setActive(i), 90)
  }
  const cancel = () => window.clearTimeout(hoverTimer.current)

  return (
    <div className={styles.row}>
      {cards.map((card, i) => {
        const kind = kindFor(i, active)
        const expanded = kind === 'expanded'
        const pos = illusPosition(card.id, kind, active)
        const copyId = `${uid}-${card.id}`
        return (
          <motion.div
            key={card.id}
            layout
            transition={layoutTransition}
            initial={false}
            animate={cardColors[kind]}
            className={`${styles.card} ${styles[kind]} ${card.id === 'blocks' && kind === 'tint' ? styles.overflowVisible : ''}`}
            onMouseEnter={() => (expanded ? cancel() : queue(i))}
            onMouseLeave={cancel}
          >
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="panel"
                  layout
                  className={styles.panel}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: isStatic ? { duration: 0 } : { duration: 0.4, ease } }}
                  exit={{ opacity: 0, transition: fadeOut }}
                  transition={layoutTransition}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>

            <motion.div
              layout
              transition={layoutTransition}
              className={styles.illus}
              style={{ left: pos.left, top: pos.top }}
              aria-hidden="true"
            >
              <Artwork id={card.id} hidePhone={pos.hidePhone} isStatic={isStatic} expanded={expanded} />
            </motion.div>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="copy"
                  layout="position"
                  id={copyId}
                  className={styles.copy}
                  style={{ top: card.copyTop }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: fadeIn }}
                  exit={{ opacity: 0, transition: fadeOut }}
                  transition={layoutTransition}
                >
                  <h3 className={styles.title}>{card.title}</h3>
                  <p className={styles.text}>{card.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {!expanded && (
                <motion.span
                  key="plus"
                  layout="position"
                  className={styles.plus}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: fadeIn }}
                  exit={{ opacity: 0, transition: fadeOut }}
                  transition={layoutTransition}
                >
                  <PlusIcon />
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="button"
              className={styles.hit}
              aria-expanded={expanded}
              aria-controls={expanded ? copyId : undefined}
              aria-label={card.title}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

/** Tablet / mobile (<1200): every card shows its text and illustration, stacked. */
function CardStack() {
  return (
    <ul className={styles.stack}>
      {cards.map((card) => (
        <li key={card.id} className={styles.stackCard}>
          <div className={styles.stackCopy}>
            <h3 className={styles.title}>{card.title}</h3>
            <p className={styles.text}>{card.text}</p>
          </div>
          <div className={styles.stackPanel} aria-hidden="true">
            <span className={`${styles.stackArt} ${styles[`stackArt_${card.id}`] ?? ''}`}>
              <Artwork id={card.id} />
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
