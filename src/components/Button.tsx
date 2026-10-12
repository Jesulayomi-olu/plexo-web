import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useStaticMotion } from '../lib/motion'
import styles from './Button.module.css'

/**
 * Figma component "Button" (Design system → Buttons), Size=Medium.
 * Default / Hover / Pressed / Focus colours come straight from the component variants.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'contrast'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  /** Renders an <a> when set, otherwise a <button>. */
  href?: string
  fullWidth?: boolean
  className?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  'aria-label'?: string
}

export function Button({
  children,
  variant = 'primary',
  href,
  fullWidth = false,
  className,
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const isStatic = useStaticMotion()
  const classes = [styles.button, styles[variant], fullWidth && styles.fullWidth, className]
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
    <motion.button type={type} className={classes} whileTap={tap} transition={transition} onClick={onClick} aria-label={ariaLabel}>
      <span className={styles.label}>{children}</span>
    </motion.button>
  )
}
