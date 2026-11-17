import type { Metadata } from 'next'
import CheckEmail from '../../../../sections/auth/CheckEmail'

export const metadata: Metadata = {
  title: 'Check your inbox — Plexo',
  description: 'We have emailed you a link to reset your Plexo password.',
  robots: { index: false },
}

// Figma "Password Reset" (1296:8992). `?email=` is the address the link went to.
export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { email } = await searchParams
  const address = typeof email === 'string' && email.trim() ? email.trim() : undefined
  return <CheckEmail email={address} />
}
