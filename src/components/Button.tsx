'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useStaticMotion } from '../lib/motion'
import styles from './Button.module.css'

/**
 * Figma component "Button" (Design system → Buttons), Size=Medium.
 * Default / Hover / Pressed / Focus colours come straight from the component variants.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'contrast' | 'white'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  /** Size=Small (32px) at every width; otherwise Medium on desktop and Large on phones. */
  size?: 'default' | 'small'
  /** Renders an <a> when set, otherwise a <button>. */
  href?: string
  fullWidth?: boolean
  className?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  'aria-label'?: string
  /** For a button that opens a dialog. */
  'aria-haspopup'?: 'dialog'
  'aria-expanded'?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  href,
  fullWidth = false,
  className,
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
  'aria-haspopup': ariaHasPopup,
  'aria-expanded': ariaExpanded,
}: ButtonProps) {
  const isStatic = useStaticMotion()
  const classes = [styles.button, styles[variant], size === 'small' && styles.small, fullWidth && styles.fullWidth, className]
    .filter(Boolean)
    .join(' ')
  const tap = isStatic ? undefined : { scale: 0.97 }
  const transition = { type: 'spring', stiffness: 500, damping: 30 } as const

  if (href) {
    return (
      <motion.a href={href} className={classes} whileTap={tap} transition={transition} onClick={onClick} aria-label={ariaLabel}>
        <span className={styles.label}>{children}</span>
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      className={classes}
      whileTap={tap}
      transition={transition}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
    >
      <span className={styles.label}>{children}</span>
    </motion.button>
  )
}
