import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import styles from './CodeReveal.module.css'

/*
 * Line-by-line code reveal over the exported SDK window (dev-sdk.webp, 515×515).
 * A cover in the code panel's colour (#232323) hides the code and steps down one line at a time,
 * with a soft leading edge so each line fades in as it is uncovered. Window chrome, header and
 * footer stay visible throughout. Plays once when the window is mostly on screen.
 */
const SIZE = 515
/** Top of each code line in the image (1× px), measured from the export. */
const LINE_TOPS = [115, 134, 172, 190, 209, 228, 247, 264, 285, 320, 339, 358, 376, 395] as const
const COVER = { left: 24, right: 490, bottom: 414 }
const STEP_SECONDS = 0.085

const pct = (v: number) => `${(v / SIZE) * 100}%`

export function CodeReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const play = useInView(ref, { once: true, amount: 0.6 })

  // Cover tops: before line k is shown the cover starts just above it; finally it sits at the bottom.
  const tops = [...LINE_TOPS.map((y) => y - 8), COVER.bottom]
  // Keyframes: a quick move to each next line, then a short hold (stepped typing rhythm).
  const keyframes: number[] = [tops[0]]
  const times: number[] = [0]
  const total = (tops.length - 1) * STEP_SECONDS
  tops.slice(1).forEach((top, i) => {
    const start = i * STEP_SECONDS
    keyframes.push(keyframes[keyframes.length - 1], top)
    times.push(start / total, Math.min(1, (start + STEP_SECONDS * 0.7) / total))
  })
  // End exactly at 1 with a final hold on the last position.
  keyframes.push(keyframes[keyframes.length - 1])
  times.push(1)

  return (
    <div ref={ref} className={styles.wrap}>
      {children}
      <motion.span
        className={styles.cover}
        aria-hidden="true"
        style={{ left: pct(COVER.left), width: pct(COVER.right - COVER.left), bottom: pct(SIZE - COVER.bottom) }}
        initial={{ top: pct(tops[0]) }}
        animate={play ? { top: keyframes.map(pct) } : undefined}
        transition={{ duration: total, times, ease: 'easeOut', delay: 0.25 }}
      />
    </div>
  )
}
