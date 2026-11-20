import { useMotionValue, type MotionValue } from 'framer-motion'
import { useLayoutEffect, useRef, type RefObject } from 'react'

/*
 * The template rows' glide: an endless row that drifts left on its own and that visitors can take over at
 * any time (trackpad swipe or shift + wheel, drag with a mouse or finger with a little momentum on release,
 * or the arrow keys through `nudge`). The glide pauses on hover and while they interact, then resumes.
 * Vertical scrolling always scrolls the page. It only runs while the row is on screen.
 *
 * Markup: a clipped viewport (`viewportRef`, give it `touch-action: pan-y`) holding a flex track moved by
 * `x`, which holds several copies of the list; `listRef` goes on the second copy, the one shown at rest.
 */

type GlideOptions = {
  /** Glide on its own. Off for reduced motion and capture mode; visitors can still move the row. */
  auto: boolean
  /** Glide speed in px/s. */
  speed: number
  /** How long the glide waits after the visitor stops interacting (ms). */
  resumeAfter?: number
  /** Where the shown copy rests, in px right of centred (Figma rounding). */
  restOffset?: number
}

export function useGlide({ auto, speed, resumeAfter = 1400, restOffset = 0 }: GlideOptions): {
  viewportRef: RefObject<HTMLDivElement | null>
  listRef: RefObject<HTMLUListElement | null>
  x: MotionValue<number>
  nudge: (px: number) => void
} {
  const viewportRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const x = useMotionValue(0)
  const nudgeRef = useRef<(px: number) => void>(() => {})

  // A layout effect, so the row is in its resting place before the first paint.
  useLayoutEffect(() => {
    const vp = viewportRef.current
    const list = listRef.current
    const track = list?.parentElement
    if (!vp || !list || !track) return

    let period = 1
    let start = 0
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
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      period = list.offsetWidth + gap
      // The second copy sits centred in the viewport, as the design shows the row.
      start = (vp.clientWidth - list.offsetWidth) / 2 + restOffset - period
    }
    measure()
    const resize = new ResizeObserver(() => {
      measure()
      render()
    })
    resize.observe(vp)
    resize.observe(list)
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (!dragging) {
        if (Math.abs(velocity) > 0.005) {
          offset += velocity * dt
          velocity *= Math.pow(0.93, dt / 16)
          holdUntil = now + resumeAfter
        } else if (auto && !hovering && now > holdUntil) {
          offset += (speed * dt) / 1000
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
      holdUntil = performance.now() + resumeAfter
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
      holdUntil = performance.now() + resumeAfter
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
      holdUntil = performance.now() + resumeAfter
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
  }, [auto, speed, resumeAfter, restOffset, x])

  return { viewportRef, listRef, x, nudge: (px) => nudgeRef.current(px) }
}
