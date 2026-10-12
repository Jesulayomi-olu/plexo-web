import { animate, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ease } from '../lib/motion'
import styles from './ProblemScene.module.css'

/*
 * Problem card illustrations rebuilt from Figma ("Frame 25", 217×293) so their numbers can count:
 * - "dms": the red badge pops in and counts up to 23 unread while the message lines stack in.
 * - "apps": five app tiles pop in one after another while the total counts up to $148/mo.
 * Plays once, when the card is mostly on screen.
 */
type Kind = 'dms' | 'apps'

function useCountUp(target: number, play: boolean, delay: number, duration: number) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!play) return
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [play, target, delay, duration])
  return value
}

const LINES = [
  { y: 34, w: 120, opacity: 0.5 },
  { y: 51, w: 90, opacity: 0.7 },
  { y: 68, w: 130, opacity: 1 },
  { y: 85, w: 70, opacity: 1 },
] as const

function DmsScene({ play }: { play: boolean }) {
  const unread = useCountUp(23, play, 0.35, 1.2)
  return (
    <div className={styles.dms}>
      <motion.span
        className={styles.badge}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={play ? { opacity: 1, scale: 1 } : undefined}
        transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.2 }}
      >
        {unread} unread
      </motion.span>
      {LINES.map((line, i) => (
        <motion.span
          key={line.y}
          className={styles.line}
          style={{ top: line.y, width: line.w }}
          initial={{ opacity: 0, x: -8 }}
          animate={play ? { opacity: line.opacity, x: 0 } : undefined}
          transition={{ duration: 0.5, ease, delay: 0.45 + i * 0.12 }}
        />
      ))}
    </div>
  )
}

function AppsScene({ play }: { play: boolean }) {
  const total = useCountUp(148, play, 0.45, 1.3)
  return (
    <div className={styles.apps}>
      <div className={styles.tiles}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className={styles.tile}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={play ? { opacity: 1, scale: 1 } : undefined}
            transition={{ type: 'spring', stiffness: 420, damping: 24, delay: 0.2 + i * 0.1 }}
          />
        ))}
      </div>
      <motion.span
        className={styles.total}
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : undefined}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        ${total}/mo
      </motion.span>
    </div>
  )
}

export function ProblemScene({ kind, label, className }: { kind: Kind; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const play = useInView(ref, { once: true, amount: 0.6 })
  return (
    <div
      ref={ref}
      className={[styles.frame, kind === 'dms' ? styles.frameDms : styles.frameApps, className].filter(Boolean).join(' ')}
      role="img"
      aria-label={label}
    >
      <span className={styles.bar} />
      <span className={styles.panel} />
      {kind === 'dms' ? <DmsScene play={play} /> : <AppsScene play={play} />}
    </div>
  )
}
