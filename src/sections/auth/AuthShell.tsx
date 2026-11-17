import type { ReactNode } from 'react'
import AuthPanel from './AuthPanel'
import styles from './AuthShell.module.css'

/**
 * The frame shared by the auth screens (Figma 1296:8209 and siblings): the green panel on the left and
 * the form column on the right. Rendered by `src/app/(auth)/layout.tsx`, so the panel stays put while
 * you move between log in, sign up and the reset steps.
 */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <AuthPanel />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
