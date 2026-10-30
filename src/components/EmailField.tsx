import { Button } from './Button'
import styles from './EmailField.module.css'

/**
 * Figma "Email input" (the footer's and the Resources "Newsletter" band's): 320×50, white, 1px #d7d8d3,
 * r12, padding 4 4 4 16; the 16px mail icon, 8, the email input, then the Secondary "Subscribe" (r8).
 * Its form and label belong to the caller.
 */
export function EmailField({ id, className }: { id: string; className?: string }) {
  return (
    <div className={`${styles.field} ${className ?? ''}`}>
      <span className={styles.mailIcon} aria-hidden="true">
        <img src="/assets/footer/mail.svg" width={14.6668} height={12} alt="" />
      </span>
      <input
        id={id}
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@business.com"
        className={styles.input}
      />
      <Button type="submit" variant="secondary" className={styles.subscribe}>
        Subscribe
      </Button>
    </div>
  )
}
