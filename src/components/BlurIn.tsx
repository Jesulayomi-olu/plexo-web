import { motion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { focusEase, useStaticMotion } from '../lib/motion'

type BlurInProps = {
  children: ReactNode
  /** Seconds after page load before this element starts coming into focus. */
  delay?: number
  /** Starting blur in px (larger text can take a larger blur). */
  blur?: number
  /** Seconds until fully sharp; opacity reaches 1 at ~70% of this. */
  duration?: number
  className?: string
  as?: 'div' | 'h1' | 'p' | 'span'
  /** 'load' (default) plays on page load; 'view' plays the first time it scrolls into view. */
  trigger?: 'load' | 'view'
}

/**
 * Blur-to-focus entrance (Linear-style): starts soft and nearly transparent, then sharpens into focus
 * while fading to full opacity. Plays once on page load; the filter is removed afterwards so text
 * renders crisply. Static for reduced-motion users and in capture mode.
 */
export function BlurIn({ children, delay = 0, blur = 12, duration = 1.6, className, as = 'div', trigger = 'load' }: BlurInProps) {
  const isStatic = useStaticMotion()

  if (isStatic) {
    const Tag = as as ElementType
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = motion[as]
  const focused = { opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0.06, filter: `blur(${blur}px)` }}
      animate={trigger === 'load' ? focused : undefined}
      whileInView={trigger === 'view' ? focused : undefined}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        filter: { duration, ease: focusEase, delay },
        opacity: { duration: duration * 0.7, ease: focusEase, delay },
      }}
    >
      {children}
    </MotionTag>
  )
}
