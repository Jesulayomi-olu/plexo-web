import type { Metadata } from 'next'
import ResetPasswordForm from '../../../sections/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Create a new password — Plexo',
  description: 'Choose a new password for your Plexo account.',
  robots: { index: false },
}

// Figma "Password Reset" (1296:9069). `?token=` comes from the link in the reset email.
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { token } = await searchParams
  return <ResetPasswordForm token={typeof token === 'string' ? token : undefined} />
}
