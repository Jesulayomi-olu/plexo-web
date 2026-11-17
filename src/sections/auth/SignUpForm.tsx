'use client'

import { useState, type FormEvent } from 'react'
import { APP_HOME_HREF, signUp } from '../../lib/auth'
import { LOGIN_HREF } from '../navData'
import { AuthScreen, formStyles as styles, GoogleButton, OrDivider, PasswordRules, SubmitButton, SwitchLine, TextField } from './AuthForm'
import { useAuthForm, type Errors } from './useAuthForm'
import { emailError, meetsPasswordRules, messages } from './validation'

type Key = 'name' | 'email' | 'password' | 'confirm'

function validate(values: Record<Key, string>): Errors<Key> {
  return {
    name: values.name.trim() ? undefined : messages.nameRequired,
    email: emailError(values.email),
    password: meetsPasswordRules(values.password) ? undefined : messages.passwordRules,
    confirm: !values.confirm ? messages.confirmRequired : values.confirm !== values.password ? messages.mismatch : undefined,
  }
}

/**
 * Create Account (Figma 1296:8209; password focused with its checklist 1296:8405; passwords that don't
 * match 1296:8606). Frame 1296:8606's second, empty "CONFIRM PASSWORD" field is a stray duplicate and
 * isn't rendered.
 *
 * The checklist shows while the password field has focus, and while a typed password still misses a
 * rule. "Passwords do not match" shows on leaving "Confirm password" and on submit, and clears as soon
 * as the two match.
 */
export default function SignUpForm() {
  const { values, errors, set, check, flag, ids } = useAuthForm<Key>({ name: '', email: '', password: '', confirm: '' }, validate)
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
    const result = await signUp({ name: values.name.trim(), email: values.email.trim(), password: values.password })
    setPending(false)
    // TODO(app): once sign-up is connected, take the new user into the app.
    if (result.ok && APP_HOME_HREF) window.location.assign(APP_HOME_HREF)
    // Not connected yet ({ ok: false, error: 'not-connected' }): nothing to show; the form stays as it is.
  }

  return (
    <AuthScreen title="Create account">
      <form className={styles.stack40} method="post" noValidate onSubmit={onSubmit} aria-busy={pending || undefined}>
        <div className={styles.stack24}>
          <GoogleButton />
          <OrDivider />
          <TextField
            id={ids.name}
            label="Full name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Enter your full name"
            value={values.name}
            onChange={(value) => set('name', value)}
            error={errors.name}
          />
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
          <TextField
            id={ids.password}
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(value) => set('password', value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            error={errors.password}
            invalid={mismatch}
            describedBy={[rulesOpen ? rulesId : undefined, mismatch ? `${ids.confirm}-error` : undefined].filter(Boolean).join(' ') || undefined}
          >
            <PasswordRules id={rulesId} value={values.password} open={rulesOpen} />
          </TextField>
          <TextField
            id={ids.confirm}
            label="Confirm password"
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            value={values.confirm}
            onChange={(value) => set('confirm', value)}
            onBlur={onConfirmBlur}
            error={errors.confirm}
          />
        </div>
        <div className={styles.stack24}>
          <SubmitButton>Create account</SubmitButton>
          <SwitchLine text="Already have an account?" link="Log in" href={LOGIN_HREF} />
        </div>
      </form>
    </AuthScreen>
  )
}
