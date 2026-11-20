import type { Metadata } from 'next'
import PasswordUpdated from '../../../../sections/auth/PasswordUpdated'

export const metadata: Metadata = {
  title: 'Password updated — Plexo',
  description: 'Your Plexo password has been changed.',
  robots: { index: false },
}

// Figma "Password Reset" (1296:9363).
export default function PasswordUpdatedPage() {
  return <PasswordUpdated />
}
