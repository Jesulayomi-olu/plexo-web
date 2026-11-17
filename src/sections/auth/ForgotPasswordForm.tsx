'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { requestPasswordReset } from '../../lib/auth'
import { AuthScreen, formStyles as styles, SubmitButton, TextField } from './AuthForm'
import { useAuthForm, type Errors } from './useAuthForm'
import { emailError } from './validation'

function validate(values: { email: string }): Errors<'email'> {
  return { email: emailError(values.email) }
}

/**
 * Reset password (Figma 1296:8864): a valid email sends the link and opens Check your Inbox with that
 * address. Lead: full stop added.
 */
export default function ForgotPasswordForm() {
  const router = useRouter()
  const { values, errors, set, check, ids } = useAuthForm({ email: '' }, validate)
  const [pending, setPending] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending || !check()) return
    setPending(true)
    const email = values.email.trim()
    const result = await requestPasswordReset(email)
    if (result.ok) router.push(`/forgot-password/check-email?email=${encodeURIComponent(email)}`)
    else setPending(false)
  }

  return (
    <AuthScreen title="Reset password" lead="Enter your email and we'll send you a secure link to reset your password." tight>
      <form className={styles.stack40} method="post" noValidate onSubmit={onSubmit} aria-busy={pending || undefined}>
        <TextField
          id={ids.email}
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={(value) => set('email', value)}
          error={errors.email}
        />
        <SubmitButton>Send reset link</SubmitButton>
      </form>
    </AuthScreen>
  )
}
