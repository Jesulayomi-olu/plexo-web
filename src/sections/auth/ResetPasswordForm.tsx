'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPassword } from '../../lib/auth'
import { AuthScreen, formStyles as styles, PasswordRules, SubmitButton, TextField } from './AuthForm'
import { useAuthForm, type Errors } from './useAuthForm'
import { meetsPasswordRules, messages } from './validation'

type Key = 'password' | 'confirm'

function validate(values: Record<Key, string>): Errors<Key> {
  return {
    password: meetsPasswordRules(values.password) ? undefined : messages.passwordRules,
    confirm: !values.confirm ? messages.confirmRequired : values.confirm !== values.password ? messages.mismatch : undefined,
  }
}

/** The form with the reset link's `?token=`, read in the browser so the page can be plain static HTML. */
export function ResetPasswordFromLink() {
  return <ResetPasswordForm token={useSearchParams().get('token') ?? undefined} />
}

/**
 * Create new password (Figma 1296:9069): the new password with the same checklist as Create Account (16
 * below the field here), then the password again. Saving opens Password Updated. Figma labels both
 * fields "NEW PASSWORD"; the second reads "Confirm new password", as the design team asked. Lead: full stop
 * added. `token` is the `?token=` of the reset link, passed on to `resetPassword`.
 */
export default function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter()
  const { values, errors, set, check, flag, ids } = useAuthForm<Key>({ password: '', confirm: '' }, validate)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [pending, setPending] = useState(false)

  const rulesOpen =
    passwordFocused || Boolean(errors.password) || (values.password !== '' && !meetsPasswordRules(values.password))
  const mismatch = errors.confirm === messages.mismatch
  const rulesId = `${ids.password}-rules`

  const onConfirmBlur = () => {
    if (values.password && values.confirm && values.confirm !== values.password) flag('confirm', messages.mismatch)
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending || !check()) return
    setPending(true)
    const result = await resetPassword({ password: values.password, token })
    if (result.ok) router.push('/reset-password/done')
    else setPending(false)
  }

  return (
    <AuthScreen title="Create new password" lead="Choose a new password for your Plexo account.">
      <form className={styles.stack24} method="post" noValidate onSubmit={onSubmit} aria-busy={pending || undefined}>
        <div className={styles.stack16}>
          <TextField
            id={ids.password}
            label="New password"
            type="password"
            name="new-password"
            autoComplete="new-password"
            placeholder="Enter your new password"
            value={values.password}
            onChange={(value) => set('password', value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            error={errors.password}
            invalid={mismatch}
            describedBy={[rulesOpen ? rulesId : undefined, mismatch ? `${ids.confirm}-error` : undefined].filter(Boolean).join(' ') || undefined}
          >
            <PasswordRules id={rulesId} value={values.password} open={rulesOpen} gap={16} />
          </TextField>
          <TextField
            id={ids.confirm}
            label="Confirm new password"
            type="password"
            name="confirm-new-password"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            value={values.confirm}
            onChange={(value) => set('confirm', value)}
            onBlur={onConfirmBlur}
            error={errors.confirm}
          />
        </div>
        <SubmitButton>Save password</SubmitButton>
      </form>
    </AuthScreen>
  )
}
