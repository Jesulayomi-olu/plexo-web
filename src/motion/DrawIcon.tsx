import type { CSSProperties } from 'react'
import styles from './DrawIcon.module.css'

type DrawIconProps = {
  /** Inline SVG markup prepared with `prepareDrawableSvg`. */
  svg: string
  /** Start drawing (lines draw in, then fills fade in). Before that the icon is hidden. */
  play: boolean
  /** Render the finished icon immediately (reduced motion / capture mode). */
  isStatic?: boolean
  /** Seconds before the first line starts. */
  delay?: number
  /** Seconds each line takes to draw. */
  duration?: number
  className?: string
  style?: CSSProperties
}

/**
 * Draw-on: an icon whose outlines draw themselves line by line (staggered), after which any fills
 * fade in. Plays once when `play` becomes true.
 */
export function DrawIcon({ svg, play, isStatic = false, delay = 0, duration = 1.2, className, style }: DrawIconProps) {
  const state = isStatic ? '' : play ? styles.drawing : styles.pending
  return (
    <span
      className={[styles.icon, state, className].filter(Boolean).join(' ')}
      style={{ '--draw-delay': `${delay}s`, '--draw-duration': `${duration}s`, ...style } as CSSProperties}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
