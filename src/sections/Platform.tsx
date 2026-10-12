import {
  motion,
  useAnimate,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type Easing,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { Reveal } from '../components/Reveal'
import { isPreviewMode, useStaticMotion } from '../lib/motion'
import styles from './Platform.module.css'
import { features, type Feature } from './platformData'

/**
 * Figma "Platform" (241:4025): 1440×924, white. The heading sits in the centre and nine
 * feature cards are absolutely positioned around it. Copy and positions are verbatim from Figma.
 *
 * ≥1440: exact positions on a 1440 canvas centred in the viewport.
 * 1200–1439: the whole composition scales down uniformly, so cards never collide with the heading.
 * <1200: heading on top, cards in a responsive grid (see Platform.module.css).
 */
const CANVAS_WIDTH = 1440
const DESKTOP_QUERY = '(min-width: 1200px)'

/** Scale factor for the 1440 canvas plus whether the desktop composition is active. */
function useCanvasScale() {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ scale: 1, desktop: true })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const media = window.matchMedia(DESKTOP_QUERY)
    const update = () => {
      setState({ scale: Math.min(1, el.clientWidth / CANVAS_WIDTH), desktop: media.matches })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    media.addEventListener('change', update)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', update)
    }
  }, [])

  return { ref, ...state }
}

/*
 * Preview motion.
 * Desktop: "orbit-in, then float + bounce wave, with cursor parallax".
 * 1. Orbit-in (once, when the composition is a third on screen): every card sweeps out from behind
 *    the heading along a curved path into its Figma position, one after another clockwise from the top.
 * 2. Float (idle loop): each card bobs ±6px on its own 4.6–6.1s rhythm, so they never move in unison.
 * 3. Bounce wave (every 6.5s): a ripple runs clockwise around the heading; each card in turn lifts,
 *    drops, rebounds slightly and settles, its shadow growing and its icon popping at the top.
 * 4. Parallax: cards shift a few pixels with the cursor; outer cards move more, as if orbiting.
 * Tablet and mobile (grid): cards fade up as they scroll in, and the bounce wave runs in reading order.
 * The wave pauses while a card is hovered; both loops stop while the section is off screen.
 */
const HEADING_CENTER = { x: 720, y: 462.5 }
const ORBIT_SECONDS = 1.4
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/** Keyframes along a curved (quadratic Bézier) path from the heading centre to the card's place. */
function orbitPath(f: Feature) {
  const cx = f.x + f.w / 2
  const cy = f.y + 30
  const sx = HEADING_CENTER.x - cx
  const sy = HEADING_CENTER.y - cy
  // Control point: halfway, pushed sideways so every card curves the same way (a gentle swirl).
  const kx = sx / 2 - sy * 0.35
  const ky = sy / 2 + sx * 0.35
  const xs: number[] = []
  const ys: number[] = []
  const steps = 14
  for (let i = 0; i <= steps; i++) {
    const t = easeOutCubic(i / steps)
    xs.push((1 - t) ** 2 * sx + 2 * (1 - t) * t * kx)
    ys.push((1 - t) ** 2 * sy + 2 * (1 - t) * t * ky)
  }
  return { xs, ys, distance: Math.hypot(sx, sy), angle: Math.atan2(-sy, -sx) }
}

const orbits = features.map(orbitPath)
const maxDistance = Math.max(...orbits.map((o) => o.distance))
/** Rank of each card going clockwise from the top (12 o'clock). */
const orbitOrder = (() => {
  const ranked = orbits
    .map((o, i) => ({ i, a: (o.angle + Math.PI * 2.5) % (Math.PI * 2) }))
    .sort((p, q) => p.a - q.a)
  const order: number[] = []
  ranked.forEach((p, rank) => {
    order[p.i] = rank
  })
  return order
})()
/** Last card lands at 0.35 + 8 × 0.07 + 1.4 ≈ 2.3s; the first wave follows a beat later. */
const ORBIT_DONE_SECONDS = 0.35 + (features.length - 1) * 0.07 + ORBIT_SECONDS

/**
 * Float rhythm per card: near-equal periods (5.4–6.2s) with phases spread by the golden ratio
 * (negative delay), so neighbours stay out of step instead of drifting into unison.
 */
function floatStyle(i: number) {
  const duration = 5.4 + (i % 3) * 0.4
  const phase = (i * 0.618) % 1
  return { '--float-duration': `${duration}s`, '--float-delay': `${-(phase * duration).toFixed(2)}s` } as CSSProperties
}

/* Bounce: lift, drop, small rebound, settle (gravity-like: ease out going up, ease in coming down). */
const WAVE_SECONDS = 6.5
const WAVE_STAGGER = 0.11
const HOP_SECONDS = 0.95
const HOP_TIMES = [0, 0.3, 0.6, 0.8, 1]
const HOP_Y = [0, -1, 0, -0.25, 0]
const HOP_EASE: Easing[] = ['easeOut', 'easeIn', 'easeOut', 'easeIn']

/** Counts bounce waves while running: the first after `firstDelay`, then one every WAVE_SECONDS. */
function useWave(running: boolean, firstDelay: number) {
  const [wave, setWave] = useState(0)
  const waved = useRef(false)
  useEffect(() => {
    if (!running) return
    let id = window.setTimeout(
      function tick() {
        waved.current = true
        setWave((w) => w + 1)
        id = window.setTimeout(tick, WAVE_SECONDS * 1000)
      },
      // After a pause (hover, scrolled away) the next wave comes sooner than the first.
      (waved.current ? 1.6 : firstDelay) * 1000,
    )
    return () => window.clearTimeout(id)
  }, [running, firstDelay])
  return wave
}

/** Plays one bounce each time `wave` increments, after `delay` (its place in the ripple). */
function Hop({ wave, delay, lift, children }: { wave: number; delay: number; lift: number; children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  useEffect(() => {
    if (!wave) return
    const timing = { duration: HOP_SECONDS, times: HOP_TIMES, delay }
    const controls = [
      animate(scope.current, { y: HOP_Y.map((v) => v * lift) }, { ...timing, ease: HOP_EASE }),
      animate('[data-hop-shadow]', { opacity: [0, 1, 0.1, 0.35, 0] }, { ...timing, ease: HOP_EASE }),
      animate('[data-hop-icon]', { scale: [1, 1.18, 0.96, 1.03, 1], rotate: [0, -8, 0, 0, 0] }, { ...timing, ease: 'easeOut' }),
    ]
    return () => controls.forEach((c) => c.stop())
  }, [wave, delay, lift, animate, scope])
  return (
    <div ref={scope} className={styles.hop}>
      <span data-hop-shadow className={styles.hopShadow} aria-hidden="true" />
      {children}
    </div>
  )
}

function OrbitCard({
  i,
  play,
  wave,
  mx,
  my,
  children,
}: {
  i: number
  play: boolean
  wave: number
  mx: MotionValue<number>
  my: MotionValue<number>
  children: ReactNode
}) {
  const orbit = orbits[i]
  const depth = 3 + 9 * (orbit.distance / maxDistance)
  const px = useTransform(mx, (v) => v * depth)
  const py = useTransform(my, (v) => v * depth)
  const delay = 0.35 + orbitOrder[i] * 0.07
  return (
    <motion.div className={styles.drift} style={{ x: px, y: py }}>
      <motion.div
        initial={{ x: orbit.xs[0], y: orbit.ys[0], scale: 0.55, opacity: 0 }}
        animate={play ? { x: orbit.xs, y: orbit.ys, scale: 1, opacity: [0, 0, 1, 1] } : undefined}
        transition={{
          x: { duration: ORBIT_SECONDS, ease: 'linear', delay },
          y: { duration: ORBIT_SECONDS, ease: 'linear', delay },
          scale: { duration: ORBIT_SECONDS, ease: [0.22, 1, 0.36, 1], delay },
          // Invisible until it has cleared the heading, then fades in on the way out.
          opacity: { duration: ORBIT_SECONDS, times: [0, 0.18, 0.5, 1], delay },
        }}
      >
        <div className={styles.float} style={floatStyle(i)}>
          <Hop wave={wave} delay={orbitOrder[i] * WAVE_STAGGER} lift={12}>
            {children}
          </Hop>
        </div>
      </motion.div>
    </motion.div>
  )
}

function PlatformCard({ f }: { f: Feature }) {
  return (
    <article className={`${styles.card} ${f.flush ? styles.cardFlush : ''}`}>
      <div className={styles.cardHead}>
        <span data-hop-icon className={styles.iconTile} style={{ background: f.accent }} aria-hidden="true">
          <img src={`/assets/icons/${f.icon}.svg`} width={15} height={15} alt="" />
        </span>
        <h3 className={styles.title}>{f.title}</h3>
      </div>
      <p className={styles.body}>{f.body}</p>
    </article>
  )
}

export default function Platform() {
  const isStatic = useStaticMotion()
  const { ref, scale, desktop } = useCanvasScale()
  const drift = desktop && !isStatic
  const live = isPreviewMode && !isStatic
  const orbit = live && desktop

  // Orbit preview: starts when a third of the composition is on screen; parallax follows the cursor.
  const canvasRef = useRef<HTMLDivElement>(null)
  const orbitPlay = useInView(canvasRef, { once: true, amount: 0.35 })
  const onScreen = useInView(canvasRef, { amount: 0.25 })
  const [hovered, setHovered] = useState(false)
  const wave = useWave(live && orbitPlay && onScreen && !hovered, desktop ? ORBIT_DONE_SECONDS + 1.1 : 2.2)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const mx = useSpring(pointerX, { stiffness: 50, damping: 18 })
  const my = useSpring(pointerY, { stiffness: 50, damping: 18 })
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!orbit || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - box.left) / box.width - 0.5) * 2)
    pointerY.set(((event.clientY - box.top) / box.height - 0.5) * 2)
  }
  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section
      id="products"
      data-section="products"
      className={styles.section}
      aria-labelledby="platform-title"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div ref={ref} className={styles.stage} style={{ '--scale': scale } as CSSProperties}>
        <div ref={canvasRef} className={styles.canvas} data-idle={onScreen ? 'on' : 'off'}>
          <Reveal className={styles.headingWrap}>
            <h2 id="platform-title" className={`h2 ${styles.heading}`}>
              Everything your business needs online
            </h2>
          </Reveal>

          <ul className={styles.cards}>
            {features.map((f, i) => (
              <li
                key={f.title}
                className={styles.slot}
                style={{ '--x': `${f.x}px`, '--y': `${f.y}px`, '--w': `${f.w}px` } as CSSProperties}
                onPointerEnter={live ? (event) => event.pointerType === 'mouse' && setHovered(true) : undefined}
                onPointerLeave={live ? () => setHovered(false) : undefined}
              >
                {orbit ? (
                  <OrbitCard i={i} play={orbitPlay} wave={wave} mx={mx} my={my}>
                    <PlatformCard f={f} />
                  </OrbitCard>
                ) : live ? (
                  <Reveal delay={0.05 * i} className={styles.reveal}>
                    <Hop wave={wave} delay={i * WAVE_STAGGER} lift={8}>
                      <PlatformCard f={f} />
                    </Hop>
                  </Reveal>
                ) : (
                  <Reveal delay={0.05 * i} className={styles.reveal}>
                    <motion.div
                      className={styles.drift}
                      animate={drift ? { y: [0, -5, 0] } : { y: 0 }}
                      transition={
                        drift
                          ? { duration: 6 + (i % 3), ease: 'easeInOut', repeat: Infinity, delay: (i * 0.7) % 3 }
                          : { duration: 0 }
                      }
                    >
                      <PlatformCard f={f} />
                    </motion.div>
                  </Reveal>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
