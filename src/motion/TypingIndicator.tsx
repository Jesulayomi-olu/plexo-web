import { useInView } from 'framer-motion'
import { useRef } from 'react'
import styles from './TypingIndicator.module.css'

/*
 * Typing indicator for the "Looking Small" illustration: the owner's dark "Typing…" bubble
 * (Figma 234:898) redrawn over the exported image at the same spot, with its three dots running
 * a wave: each dot brightens and rises in turn, left to right, on a loop. Figma's 100/60/30%
 * dot opacities are one frame of this wave. Pauses while off screen.
 */
export function TypingIndicator({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const onScreen = useInView(ref)
  return (
    <span
      ref={ref}
      className={[styles.bubble, onScreen ? '' : styles.paused, className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  )
}
