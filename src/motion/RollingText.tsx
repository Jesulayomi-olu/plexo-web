'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useStaticMotion } from '../lib/motion'
import styles from './RollingText.module.css'

const roll = {
  enter: (direction: number) => ({ y: direction > 0 ? '70%' : '-70%', opacity: 0, filter: 'blur(2px)' }),
  center: { y: '0%', opacity: 1, filter: 'blur(0px)' },
  exit: (direction: number) => ({ y: direction > 0 ? '-70%' : '70%', opacity: 0, filter: 'blur(2px)' }),
}

const toNumber = (s: string) => Number(s.replace(/[^0-9.]/g, '')) || 0

/**
 * Number roll (odometer): when `value` changes, only the characters that differ roll to their new
 * value (up when the number rises, down when it falls), with a short stagger.
 * Text styling comes from the parent, so it fits any typography.
 */
export function RollingText({ value, className }: { value: string; className?: string }) {
  const isStatic = useStaticMotion()
  // Derived state: remember the previous value to know which way to roll.
  const [previous, setPrevious] = useState(value)
  const [direction, setDirection] = useState(1)
  if (previous !== value) {
    setDirection(toNumber(value) >= toNumber(previous) ? 1 : -1)
    setPrevious(value)
  }

  if (isStatic) return <span className={className}>{value}</span>

  return (
    <span className={[styles.roll, className].filter(Boolean).join(' ')} aria-label={value}>
      {value.split('').map((ch, i) => (
        <span key={i} className={styles.slot} aria-hidden="true">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.span
              key={ch}
              className={styles.char}
              custom={direction}
              variants={roll}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: 'spring', stiffness: 320, damping: 30, delay: i * 0.04 },
                opacity: { duration: 0.22, delay: i * 0.04 },
                filter: { duration: 0.22, delay: i * 0.04 },
              }}
            >
              {ch}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}
