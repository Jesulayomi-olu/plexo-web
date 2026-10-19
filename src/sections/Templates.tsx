import { motion, useMotionValue, type MotionValue } from 'framer-motion'
import { forwardRef, useEffect, useRef, type CSSProperties, type KeyboardEvent, type RefObject } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { isCaptureMode, useStaticMotion } from '../lib/motion'
import styles from './Templates.module.css'

/**
 * Figma "How it works" (598:16996) — "Start with a template": 1440×843, #fcfcfa, padding 80/0.
 * Header (heading, lead, "View all"), then a row of template screenshots (gap 39, centred, clipped,
 * square corners): 348 · 348 · 515 · 508 · 555 wide, 468 tall — it runs past both edges. Images are
 * exported at 2× (the two tallest are cut to the row's 468px, as Figma clips them).
 *
 * Motion: the row glides left in an endless loop (starting from the Figma position). Visitors can
 * take over at any time — trackpad swipe or shift + wheel, drag with a mouse or finger (with a little
 * momentum on release), or the arrow keys — and the glide pauses on hover and while they interact,
 * then resumes. Vertical scrolling always scrolls the page. Reduced motion: no glide, manual only.
 * Capture mode: the static Figma row.
 */
const templates = [
  { src: '/assets/v2/template-fieldnote.webp', w: 348, alt: 'Software template: Fieldnote, “Know why they leave, not just when.”' },
  { src: '/assets/v2/template-solene.webp', w: 348, alt: 'Skincare store template: Solène, “Skin that looks rested, not done.”' },
  { src: '/assets/v2/template-atelier-oak.webp', w: 515, alt: 'Architecture studio template: Atelier Oak, “Quiet houses, built to last a century.”' },
  { src: '/assets/v2/template-iron-grain.webp', w: 508, alt: 'Gym template: Iron & Grain, “Strength is a skill. We coach it.”' },
  { src: '/assets/v2/template-northfold.webp', w: 555, alt: 'Brand studio template: Northfold, “We make brands people remember.”' },
] as const

/** Glide speed in px/s (one 2469px loop ≈ 100s at 1440). */
const SPEED = 24
/** How long the glide waits after the visitor stops interacting (ms). */
const RESUME_AFTER = 1400
/** Copies of the row in the glide track, so the loop never shows an empty edge. */
const COPIES = 4

const TemplateRow = forwardRef<HTMLUListElement, { hidden?: boolean }>(function TemplateRow({ hidden = false }, ref) {
  return (
    <ul ref={ref} className={styles.list} aria-hidden={hidden || undefined}>
      {templates.map((t, i) => (
        <li key={i} className={styles.card} style={{ '--w': t.w } as CSSProperties}>
          <img src={t.src} width={t.w} height={468} alt={hidden ? '' : t.alt} loading="lazy" draggable={false} />
        </li>
      ))}
    </ul>
  )
})

/**
 * Drives the row's x position: auto-glide plus wheel, drag (with momentum) and keyboard input,
 * wrapped every loop period so it is endless in both directions.
 */
function useGlide(auto: boolean): {
  viewportRef: RefObject<HTMLDivElement | null>
  listRef: RefObject<HTMLUListElement | null>
  x: MotionValue<number>
  nudge: (px: number) => void
} {
  const viewportRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const x = useMotionValue(0)
  const nudgeRef = useRef<(px: number) => void>(() => {})

  useEffect(() => {
    const vp = viewportRef.current
    const list = listRef.current
    const track = list?.parentElement
    if (!vp || !list || !track) return

    let period = 1
    let start = 0
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      period = list.offsetWidth + gap
      // Figma centres one copy in a 1441-wide frame (+0.5); the visible copy is the second one.
      start = (vp.clientWidth - list.offsetWidth) / 2 + 0.5 - period
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(vp)
    resize.observe(list)

    let offset = 0
    let velocity = 0 // px per ms (momentum after a drag or key nudge)
    let hovering = false
    let dragging = false
    let holdUntil = 0
    let last = performance.now()
    let raf = 0
    let visible = false

    const render = () => {
      const m = ((offset % period) + period) % period
      x.set(start - m)
    }
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (!dragging) {
        if (Math.abs(velocity) > 0.005) {
          offset += velocity * dt
          velocity *= Math.pow(0.93, dt / 16)
          holdUntil = now + RESUME_AFTER
        } else if (auto && !hovering && now > holdUntil) {
          offset += (SPEED * dt) / 1000
        }
      }
      render()
      raf = visible ? requestAnimationFrame(tick) : 0
    }
    const run = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    render()

    // Only animate while the row is on screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) run()
    })
    io.observe(vp)

    // Horizontal wheel / trackpad swipe moves the row; vertical wheel is left to the page.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      offset += e.deltaX
      velocity = 0
      holdUntil = performance.now() + RESUME_AFTER
      run()
    }

    // Drag with mouse or finger (touch-action: pan-y keeps vertical swipes for the page).
    let pointerId = -1
    let lastX = 0
    let lastT = 0
    let moved = false
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      dragging = true
      moved = false
      pointerId = e.pointerId
      lastX = e.clientX
      lastT = e.timeStamp
      velocity = 0
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return
      const dx = e.clientX - lastX
      if (!moved && Math.abs(dx) > 3) {
        moved = true
        vp.setPointerCapture(pointerId)
        vp.dataset.dragging = 'true'
      }
      if (!moved) return
      const dt = Math.max(1, e.timeStamp - lastT)
      offset -= dx
      velocity = 0.8 * (-dx / dt) + 0.2 * velocity
      lastX = e.clientX
      lastT = e.timeStamp
      run()
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return
      dragging = false
      if (e.timeStamp - lastT > 80) velocity = 0 // paused before letting go: no fling
      holdUntil = performance.now() + RESUME_AFTER
      delete vp.dataset.dragging
      if (vp.hasPointerCapture(pointerId)) vp.releasePointerCapture(pointerId)
    }
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hovering = true
    }
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hovering = false
    }

    vp.addEventListener('wheel', onWheel, { passive: false })
    vp.addEventListener('pointerdown', onDown)
    vp.addEventListener('pointermove', onMove)
    vp.addEventListener('pointerup', onUp)
    vp.addEventListener('pointercancel', onUp)
    vp.addEventListener('pointerenter', onEnter)
    vp.addEventListener('pointerleave', onLeave)

    nudgeRef.current = (px: number) => {
      // Ease over to the next position (keyboard): a short burst of momentum covering ~px.
      velocity = px / 220
      holdUntil = performance.now() + RESUME_AFTER
      run()
    }

    return () => {
      cancelAnimationFrame(raf)
      raf = 0
      visible = false
      io.disconnect()
      resize.disconnect()
      vp.removeEventListener('wheel', onWheel)
      vp.removeEventListener('pointerdown', onDown)
      vp.removeEventListener('pointermove', onMove)
      vp.removeEventListener('pointerup', onUp)
      vp.removeEventListener('pointercancel', onUp)
      vp.removeEventListener('pointerenter', onEnter)
      vp.removeEventListener('pointerleave', onLeave)
    }
  }, [auto, x])

  return { viewportRef, listRef, x, nudge: (px) => nudgeRef.current(px) }
}

function GlideRow({ auto }: { auto: boolean }) {
  const { viewportRef, listRef, x, nudge } = useGlide(auto)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      nudge(e.key === 'ArrowRight' ? 320 : -320)
    }
  }
  return (
    <div
      ref={viewportRef}
      className={`${styles.row} ${styles.glide}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Templates — drag, swipe or use the arrow keys to browse"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <motion.div className={styles.glideTrack} style={{ x }}>
        {Array.from({ length: COPIES }, (_, i) =>
          i === 1 ? <TemplateRow key={i} ref={listRef} /> : <TemplateRow key={i} hidden />,
        )}
      </motion.div>
    </div>
  )
}

export default function Templates() {
  const isStatic = useStaticMotion()
  return (
    <section id="templates" data-section="templates" className={styles.section}>
      <div className={styles.head}>
        <Reveal className={styles.headText}>
          <h2 className="h2 baseline-fix">Start with a template</h2>
          <p className={`baseline-fix ${styles.lead}`}>
            From your first idea to a published website, Plexo gives you everything you need to build, customise and
            launch in one place.
          </p>
        </Reveal>
        <Reveal delay={0.08} className={styles.cta}>
          <Button href="#start">View all</Button>
        </Reveal>
      </div>

      {isCaptureMode ? (
        <div className={styles.row}>
          <div className={styles.track}>
            <TemplateRow />
          </div>
        </div>
      ) : (
        <GlideRow auto={!isStatic} />
      )}
    </section>
  )
}
