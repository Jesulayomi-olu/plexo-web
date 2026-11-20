import type { Metadata } from 'next'
import { Suspense } from 'react'
import CheckEmail, { CheckEmailFromLink } from '../../../../sections/auth/CheckEmail'

export const metadata: Metadata = {
  title: 'Check your inbox — Plexo',
  description: 'We have emailed you a link to reset your Plexo password.',
  robots: { index: false },
}

// Figma "Password Reset" (1296:8992). `?email=` is the address the link went to; it's read in the browser,
// so the page is static HTML (as on Cloudflare).
export default function CheckEmailPage() {
  return (
    <Suspense fallback={<CheckEmail />}>
      <CheckEmailFromLink />
    </Suspense>
  )
}
