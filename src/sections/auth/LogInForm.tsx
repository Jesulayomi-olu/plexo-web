'use client'

import { useId, useState, type FormEvent } from 'react'
import { APP_HOME_HREF, logIn } from '../../lib/auth'
import { SIGNUP_HREF } from '../navData'
import { AuthScreen, formStyles as styles, GoogleButton, OrDivider, SubmitButton, SwitchLine, TextField, TrailingLink } from './AuthForm'
import { isEmail, messages } from './validation'

/**
 * Welcome Back (Figma 1048:21566) and its error state (1296:8070): both fields turn red and "Incorrect
 * email or password." shows under the password. It shows on submit when the email is empty or malformed
 * or the password is empty, and when the backend rejects the details; editing either field clears it.
 */
export default function LogInForm() {
  const uid = useId()
  const emailId = `${uid}-email`
  const passwordId = `${uid}-password`
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [failed, setFailed] = useState(false)
  const [pending, setPending] = useState(false)

  const fail = (focusId: string) => {
    setFailed(true)
    document.getElementById(focusId)?.focus()
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    if (!isEmail(email)) return fail(emailId)
    if (!password) return fail(passwordId)
    setPending(true)
    const result = await logIn({ email: email.trim(), password })
    setPending(false)
    if (!result.ok && result.error === 'invalid-credentials') return fail(passwordId)
    // TODO(app): once log-in is connected, take the user into the app.
    if (result.ok && APP_HOME_HREF) window.location.assign(APP_HOME_HREF)
    // Not connected yet ({ ok: false, error: 'not-connected' }): nothing to show; the form stays as it is.
  }

  return (
    <AuthScreen title="Welcome back">
      <form className={styles.stack40} method="post" noValidate onSubmit={onSubmit} aria-busy={pending || undefined}>
        <div className={styles.stack24}>
          <GoogleButton />
          <OrDivider />
          <TextField
            id={emailId}
            label="Email address"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(value) => {
              setEmail(value)
              setFailed(false)
            }}
            invalid={failed}
            describedBy={failed ? `${passwordId}-error` : undefined}
          />
          <TextField
            id={passwordId}
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(value) => {
              setPassword(value)
              setFailed(false)
            }}
            error={failed ? messages.incorrectLogin : undefined}
            trailing={<TrailingLink href="/forgot-password">Forgot password?</TrailingLink>}
          />
        </div>
        <div className={styles.stack24}>
          {/* Figma: "SIgn in" */}
          <SubmitButton>Sign in</SubmitButton>
          <SwitchLine text="Don’t have an account?" link="Create one free" href={SIGNUP_HREF} />
        </div>
      </form>
    </AuthScreen>
  )
}
