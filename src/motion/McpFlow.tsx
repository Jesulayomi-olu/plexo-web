import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useStaticMotion } from '../lib/motion'
import diagramSvg from '../assets/motion/mcp-diagram.svg?raw'
import styles from './McpFlow.module.css'

/*
 * MCP "data flow" on the Figma diagram (234:1263, 606.2×338.76, exported as SVG).
 * In turn for Claude, ChatGPT and Cursor: the prompt bubble lights up, a small lime packet travels
 * along its dashed connector into the Plexo hub (which pings), then on to the live site (which
 * glows). The dashed lines themselves stay still, so only one small thing moves at a time.
 */

// Figma geometry, in the diagram's own coordinates.
const CARDS = [
  { x: 17.83, y: 39.22 },
  { x: 17.83, y: 140.85 },
  { x: 17.83, y: 242.48 },
] as const
/** The grey prompt bubble inside each card ("Prompt": @11.59,22.29, 155.12×40.48, r 8.91 except bottom-left 3.57). */
const BUBBLE = { dx: 11.59, dy: 22.29, w: 155.12, h: 40.48 }
const HUB = { x: 272.79, y: 144.42, w: 60.62, h: 60.62, r: 16.05 }
const LIVE = { x: 402.94, y: 85.58, w: 185.43, h: 177.77, r: 12.48 }
const JUNCTION_X = 240.869
const CYCLE_SECONDS = 3.6

type Segment = { path: SVGPathElement; from: number; to: number }

/** Animate a point along consecutive path segments at constant speed. */
function followRoute(route: Segment[], x: MotionValue<number>, y: MotionValue<number>, duration: number) {
  const lengths = route.map((s) => Math.abs(s.to - s.from))
  const total = lengths.reduce((a, b) => a + b, 0)
  return animate(0, 1, {
    duration,
    ease: [0.45, 0, 0.25, 1],
    onUpdate: (t) => {
      let d = t * total
      for (let i = 0; i < route.length; i++) {
        if (d <= lengths[i] || i === route.length - 1) {
          const s = route[i]
          const p = s.path.getPointAtLength(s.from + (s.to - s.from) * Math.min(1, d / lengths[i]))
          x.set(p.x)
          y.set(p.y)
          return
        }
        d -= lengths[i]
      }
    },
  })
}

function Ping({ progress, x, y, w, h, r, color }: { progress: MotionValue<number>; x: number; y: number; w: number; h: number; r: number; color: string }) {
  const scale = useTransform(progress, [0, 1], [1, 1.22])
  const opacity = useTransform(progress, [0, 0.15, 1], [0, 0.55, 0])
  return (
    <motion.rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      style={{ scale, opacity, transformBox: 'fill-box', transformOrigin: 'center' }}
    />
  )
}

export function McpFlow({ className }: { className?: string }) {
  const isStatic = useStaticMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const packet = useMotionValue(0)
  const ring = useMotionValue(0)
  const hubPing = useMotionValue(0)
  const livePing = useMotionValue(0)
  const glow = useTransform(packet, [0, 1], [0, 0.35])

  useEffect(() => {
    if (isStatic) return
    const svg = wrapRef.current?.querySelector('svg')
    if (!svg) return
    // Figma order: Claude, Cursor, ChatGPT, Output. Every connector starts on the left.
    const [claude, cursor, chatgpt, output] = Array.from(svg.querySelectorAll<SVGPathElement>('path[stroke-dasharray]'))
    if (!output) return
    const chatgptStart = chatgpt.getPointAtLength(0).x
    const toHub = { path: chatgpt, from: JUNCTION_X - chatgptStart, to: chatgpt.getTotalLength() }
    const routes: Segment[][] = [
      [{ path: claude, from: 0, to: claude.getTotalLength() }, toHub],
      [{ path: chatgpt, from: 0, to: chatgpt.getTotalLength() }],
      [{ path: cursor, from: 0, to: cursor.getTotalLength() }, toHub],
    ]
    const outRoute: Segment[] = [{ path: output, from: 0, to: output.getTotalLength() }]

    let cancelled = false
    const controls: { stop: () => void }[] = []
    // Keep only the most recent animations: enough to stop whatever is running on unmount.
    const run = <C extends { stop: () => void }>(c: C) => {
      controls.push(c)
      if (controls.length > 8) controls.shift()
      return c
    }
    const wait = (s: number) => new Promise<void>((resolve) => window.setTimeout(resolve, s * 1000))

    const loop = async () => {
      for (let i = 0; !cancelled; i = (i + 1) % routes.length) {
        setActive(i)
        const start = performance.now()
        run(animate(ring, 1, { duration: 0.35, ease: 'easeOut' }))
        await wait(0.15)
        if (cancelled) return
        run(animate(packet, 1, { duration: 0.2 }))
        await run(followRoute(routes[i], px, py, 0.9))
        if (cancelled) return
        run(animate(packet, 0, { duration: 0.12 }))
        hubPing.set(0)
        run(animate(hubPing, 1, { duration: 0.8, ease: 'easeOut' }))
        await wait(0.15)
        if (cancelled) return
        run(animate(packet, 1, { duration: 0.12 }))
        await run(followRoute(outRoute, px, py, 0.55))
        if (cancelled) return
        run(animate(packet, 0, { duration: 0.15 }))
        livePing.set(0)
        run(animate(livePing, 1, { duration: 0.9, ease: 'easeOut' }))
        await wait(0.2)
        run(animate(ring, 0, { duration: 0.4, ease: 'easeIn' }))
        const elapsed = (performance.now() - start) / 1000
        await wait(Math.max(0.2, CYCLE_SECONDS - elapsed))
      }
    }
    void loop()
    return () => {
      cancelled = true
      controls.forEach((c) => c.stop())
    }
  }, [isStatic, px, py, packet, ring, hubPing, livePing])

  const card = CARDS[active]
  return (
    <div ref={wrapRef} className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <div className={styles.diagram} dangerouslySetInnerHTML={{ __html: diagramSvg }} />
      {!isStatic && (
        <svg className={styles.overlay} viewBox="0 0 607 339" aria-hidden="true">
          <motion.rect
            x={card.x + BUBBLE.dx}
            y={card.y + BUBBLE.dy}
            width={BUBBLE.w}
            height={BUBBLE.h}
            rx={8.91}
            fill="rgb(184 243 74 / 0.14)"
            stroke="#74a418"
            strokeWidth={1}
            style={{ opacity: ring }}
          />
          <Ping progress={hubPing} {...HUB} color="#74a418" />
          <Ping progress={livePing} {...LIVE} color="#9fd22c" />
          <motion.circle cx={px} cy={py} r={7} fill="#b8f34a" style={{ opacity: glow }} />
          <motion.circle cx={px} cy={py} r={3.2} fill="#74a418" style={{ opacity: packet }} />
        </svg>
      )}
    </div>
  )
}
