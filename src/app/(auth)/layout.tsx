import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import AuthShell from '../../sections/auth/AuthShell'

// Sign-up, log-in and password-reset screens: full screen, without the site's nav and footer. They stay
// out of search results.
export const metadata: Metadata = {
  robots: { index: false },
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>
}
