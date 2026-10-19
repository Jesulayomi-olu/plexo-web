import { useEffect, useMemo, useRef, useState } from 'react'

/** Pause before character `i` shows: a beat after a line end (longer before a blank line), quick otherwise. */
function pauseBefore(text: string, i: number) {
  const prev = text[i - 1]
  if (prev === '\n') return text[i] === '\n' ? 220 : 100
  if (prev === ' ') return 20
  return 9 + Math.random() * 8
}

/**
 * When each character appears (ms from the start). Indentation appears together with the first
 * character of its line, as auto-indent would.
 */
function schedule(text: string) {
  const times: number[] = []
  let t = 0
  for (let i = 0; i < text.length; i++) {
    const indent = text[i] === ' ' && (i === 0 || text[i - 1] === '\n' || (times.length > 0 && text[i - 1] === ' ' && times[i - 1] === -1))
    if (indent) {
      times.push(-1)
      continue
    }
    t += i === 0 ? 0 : pauseBefore(text, i)
    times.push(t)
  }
  // Give indentation the time of the character that follows it.
  for (let i = times.length - 1, next = t; i >= 0; i--) {
    if (times[i] === -1) times[i] = next
    else next = times[i]
  }
  return times
}

/**
 * Types `text` out once, like someone writing it in an editor: slightly uneven speed, a beat at each
 * line end, indentation appearing at once (about 6.5s for the Developers snippet). Driven by animation
 * frames on a fixed schedule, so the pace doesn't depend on timer precision. Pauses while `active` is
 * false (e.g. scrolled out of view) and picks up where it stopped. Returns how many characters show.
 */
export function useCodeTyping(text: string, active: boolean, startDelay = 500) {
  const times = useMemo(() => schedule(text), [text])
  const [count, setCount] = useState(0)
  const elapsed = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    if (elapsed.current !== null && elapsed.current >= times[times.length - 1]) return
    // Wait before the first character, and a moment on resuming.
    elapsed.current = elapsed.current === null ? -startDelay : elapsed.current - 240
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      elapsed.current = (elapsed.current ?? 0) + (now - last)
      last = now
      let n = 0
      while (n < times.length && times[n] <= elapsed.current) n++
      setCount((current) => (current === n ? current : n))
      if (n < times.length) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, times, startDelay])

  return { count, done: count >= text.length }
}
