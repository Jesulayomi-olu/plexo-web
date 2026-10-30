'use client'

import { cubicBezier, motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Reveal } from '../../components/Reveal'
import { useCaptureMode, useStaticMotion } from '../../lib/motion'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { DevCodePanel } from '../DevCodePanel'
import styles from './DevStack.module.css'

/**
 * MCP and API "Developers" (669:29077): 1440×885, #fcfcfa, padding 80. Header (pill, "Prompt from your
 * terminal.", lead) 80 above a 1280×515 row, gap 40: the home page's quickstart panel (717 wide, cut to
 * its 620 column) and five feature tiles (415×143, lime corner brackets) stacked 72 apart.
 *
 * Motion (Figma's note on 669:29126, and the home page's step cards): the row pins in the window and
 * the tiles stack as you scroll. Only the first tile shows at first; each of the others holds below
 * (its top peeking in at the bottom of the window), then rises to land on the one before, which stays
 * underneath. The last state is the Figma stack. Below 1200 the panel sits above the tiles and pins with
 * them. Reduced motion lists the tiles in full; capture mode shows the Figma stack.
 */
type Tile = { title: string; text: string }

// Figma's Webhooks line ends with a stray "]" ("…form fills and orders.]"); it is left out.
const tiles: Tile[] = [
  { title: 'Webhooks', text: 'Get notified on publish, form fills and orders.' },
  { title: 'Clean export.', text: 'HTML, React, MJML. Ship it as is.' },
  { title: 'REST API', text: 'Create, update and publish pages from your code.' },
  { title: 'SDK', text: 'A full page and email builder in your React app' },
  { title: 'Design tokens', text: 'Sync once. On brand forever.' },
]

/** Tiles land 72px apart (143 tall, −71 margins in Figma). */
const STEP = 72
/** Scroll pace in px: each tile holds, then the next one rises. */
const PACE = { desktop: { hold: 120, rise: 260 }, mobile: { hold: 100, rise: 240 } }
/** How much of the next tile shows at the bottom of the window while the current one holds. */
const PEEK = 32
/** Space kept clear under the nav and below the pinned content. */
const PIN_MARGIN = 24
const easeInOut = cubicBezier(0.65, 0, 0.35, 1)
const linear = (t: number) => t

/** A tile; in the stack each one sits STEP below the one before, all sharing one grid cell. */
function TileCard({ tile, index, stacked, y }: { tile: Tile; index: number; stacked: boolean; y?: MotionValue<number> }) {
  return (
    <motion.li className={styles.tile} style={{ y, marginTop: stacked ? index * STEP : undefined }}>
      <div className={styles.face}>
        <h3 className={styles.title}>{tile.title}</h3>
        <p className={styles.text}>{tile.text}</p>
      </div>
      <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
    </motion.li>
  )
}

/** Tile i's offset from its place, by scroll travelled: it waits out of sight, peeks, holds, then rises. */
function useTileY(travelled: MotionValue<number>, i: number, hold: number, rise: number, peek: number, hidden: number) {
  const start = hold * i + rise * (i - 1) // when tile i starts to rise
  const input = i === 1 ? [hold, hold + rise] : [start - hold - rise, start - hold, start, start + rise]
  const output = i === 1 ? [peek, 0] : [hidden, peek, peek, 0]
  return useTransform(travelled, input, output, { ease: i === 1 ? easeInOut : [easeInOut, linear, easeInOut] })
}

function Code() {
  return (
    <div className={styles.code}>
      <div className={styles.codeInner}>
        <DevCodePanel />
      </div>
    </div>
  )
}

/** The pinned version: the code window and the tiles (side by side, or stacked below 1200) stick while the tiles stack. */
function ScrollStack({ desktop }: { desktop: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLOListElement>(null)
  const { hold, rise } = desktop ? PACE.desktop : PACE.mobile
  const distance = hold * tiles.length + rise * (tiles.length - 1)
  const [fit, setFit] = useState({ height: 515, scale: 1, top: 96, start: 0, bottom: 800, stackTop: 42 })

  // Natural height → scale to fit under the nav → sticky top (centred) → where the window's bottom
  // edge falls, in the pinned content's own (unscaled) coordinates.
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      const inner = innerRef.current
      const stack = stackRef.current
      if (!track || !inner || !stack) return
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72
      const height = inner.offsetHeight
      const room = window.innerHeight - nav - PIN_MARGIN * 2
      const scale = Math.min(1, room / height)
      const top = nav + PIN_MARGIN + Math.max(0, (room - height * scale) / 2)
      const start = track.getBoundingClientRect().top + window.scrollY - top
      // Where the tiles start in the pinned content (centred in the 515 row on desktop, under the code
      // window below 1200); offsetTop is layout px, unaffected by the --fit scale.
      const stackTop = stack.offsetTop
      setFit({ height, scale, top, start, bottom: (window.innerHeight - top) / scale, stackTop })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    if (innerRef.current) observer.observe(innerRef.current)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [desktop])

  const { scrollY } = useScroll()
  const raw = useTransform(scrollY, [fit.start, fit.start + distance], [0, distance], { clamp: true })
  const travelled = useSpring(raw, { stiffness: 220, damping: 36, mass: 0.6 })
  const slot = (i: number) => fit.stackTop + STEP * i
  const ys = [
    useTileY(travelled, 1, hold, rise, fit.bottom - slot(1) - PEEK, fit.bottom - slot(1) + 24),
    useTileY(travelled, 2, hold, rise, fit.bottom - slot(2) - PEEK, fit.bottom - slot(2) + 24),
    useTileY(travelled, 3, hold, rise, fit.bottom - slot(3) - PEEK, fit.bottom - slot(3) + 24),
    useTileY(travelled, 4, hold, rise, fit.bottom - slot(4) - PEEK, fit.bottom - slot(4) + 24),
  ]

  const stack = (
    <ol ref={stackRef} className={styles.stack}>
      {tiles.map((tile, i) => (
        <TileCard key={tile.title} tile={tile} index={i} stacked y={i > 0 ? ys[i - 1] : undefined} />
      ))}
    </ol>
  )

  const pinHeight = fit.height * fit.scale
  return (
    <>
      <div ref={trackRef} className={styles.track} style={{ height: pinHeight + distance }}>
        <div className={styles.pin} style={{ top: fit.top, height: pinHeight }}>
          <div ref={innerRef} className={styles.row} style={{ '--fit': fit.scale } as CSSProperties}>
            <Code />
            <div className={styles.stackCol}>{stack}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function DevStack() {
  const isStatic = useStaticMotion()
  const isCaptureMode = useCaptureMode()
  const desktop = useMediaQuery('(min-width: 1200px)')

  let body
  if (!isStatic) {
    body = <ScrollStack desktop={desktop} />
  } else {
    // Capture mode: the Figma stack. Reduced motion: every tile in full, one after another.
    body = (
      <div className={styles.row}>
        <Code />
        <div className={styles.stackCol}>
          <ol className={isCaptureMode ? styles.stack : styles.list}>
            {tiles.map((tile, i) => (
              <TileCard key={tile.title} tile={tile} index={i} stacked={isCaptureMode} />
            ))}
          </ol>
        </div>
      </div>
    )
  }

  return (
    <section id="developers" data-section="mcp-developers" className={styles.section} aria-labelledby="developers-title">
      <div className="container">
        <div className={styles.header}>
          <Reveal className={styles.pill}>
            <span>For developers</span>
          </Reveal>
          <Reveal delay={0.06} className={styles.intro}>
            {/* Figma ends the heading with a space, which counts when centring. */}
            <h2 id="developers-title" className={`h2 ${styles.heading}`}>
              Prompt from your terminal.&nbsp;
            </h2>
            <p className={`lead ${styles.lead}`}>Or drop the whole builder into your own product.</p>
          </Reveal>
        </div>
        {body}
      </div>
    </section>
  )
}
