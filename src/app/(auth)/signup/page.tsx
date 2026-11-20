import type { Metadata } from 'next'
import SignUpForm from '../../../sections/auth/SignUpForm'

export const metadata: Metadata = {
  title: 'Create your account — Plexo',
  description: 'Create your free Plexo account.',
  robots: { index: false },
}

// Figma "Create account" (1296:8209, 1296:8405, 1296:8606).
export default function SignUpPage() {
  return <SignUpForm />
}
