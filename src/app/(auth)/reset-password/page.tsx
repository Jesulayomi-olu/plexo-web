import type { Metadata } from 'next'
import { Suspense } from 'react'
import ResetPasswordForm, { ResetPasswordFromLink } from '../../../sections/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Create a new password — Plexo',
  description: 'Choose a new password for your Plexo account.',
  robots: { index: false },
}

// Figma "Password Reset" (1296:9069). `?token=` comes from the link in the reset email; it's read in the
// browser, so the page is static HTML (as on Cloudflare).
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordForm />}>
      <ResetPasswordFromLink />
    </Suspense>
  )
}
