'use client'

import { motion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { ease, useStaticMotion } from '../lib/motion'

type RevealProps = {
  children: ReactNode
  /** Delay in seconds, for staggering siblings. */
  delay?: number
  /** Distance in px the element travels upward while fading in. */
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'span'
}

/**
 * Fades content up into place the first time it scrolls into view.
 * Renders a plain element (no animation) for reduced-motion users and in capture mode.
 */
export function Reveal({ children, delay = 0, y = 16, className, as = 'div' }: RevealProps) {
  const isStatic = useStaticMotion()

  if (isStatic) {
    const Tag = as as ElementType
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </MotionTag>
  )
}
