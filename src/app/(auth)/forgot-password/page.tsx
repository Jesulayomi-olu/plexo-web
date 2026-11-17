import type { Metadata } from 'next'
import ForgotPasswordForm from '../../../sections/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Reset your password — Plexo',
  description: 'Get a link to reset your Plexo password.',
  robots: { index: false },
}

// Figma "Password Reset" (1296:8864).
export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
