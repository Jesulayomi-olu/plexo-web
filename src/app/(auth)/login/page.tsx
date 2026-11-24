import type { Metadata } from 'next'
import LogInForm from '../../../sections/auth/LogInForm'

export const metadata: Metadata = {
  title: 'Log in — Plexo',
  description: 'Log in to your Plexo account.',
  robots: { index: false },
}

// Figma "Sign in" (1048:21566) and "Sign in (Incorrect email/password)" (1296:8070).
export default function LogInPage() {
  return <LogInForm />
}
