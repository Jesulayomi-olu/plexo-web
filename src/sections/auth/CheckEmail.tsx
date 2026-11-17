'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { requestPasswordReset } from '../../lib/auth'
import { durations, ease, useStaticMotion } from '../../lib/motion'
import { AuthScreen, formStyles as styles } from './AuthForm'

/** A long address may wrap: prefer to break it after the @. */
function breakable(email: string) {
  const at = email.indexOf('@')
  if (at < 0) return email
  return (
    <>
      {email.slice(0, at + 1)}
      <wbr />
      {email.slice(at + 1)}
    </>
  )
}

/** How long "We’ve sent you a new link." stays after "Resend link". */
const CONFIRMATION_MS = 5000

/**
 * Check your Inbox (Figma 1296:8992): the address comes from `?email=` (set by Reset password); without
 * it the copy says "your email address" and "Resend link" goes back to Reset password. "Resend link"
 * sends the link again and confirms it briefly underneath (not in Figma). The resend line gets a closing
 * full stop.
 */
export default function CheckEmail({ email }: { email?: string }) {
  const isStatic = useStaticMotion()
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const resend = async () => {
    if (!email || state === 'sending') return
    window.clearTimeout(timer.current)
    setState('sending')
    const result = await requestPasswordReset(email)
    setState(result.ok ? 'sent' : 'idle')
    if (result.ok) timer.current = window.setTimeout(() => setState('idle'), CONFIRMATION_MS)
  }

  const lead = (
    <>
      A password reset link has been sent to {email ? <strong>{breakable(email)}</strong> : 'your email address'}. Open the email and
      follow the link to create a new password.
    </>
  )

  return (
    <AuthScreen title="Check your inbox" lead={lead}>
      <div className={styles.resendBlock}>
        <p className={styles.resend}>
          Didn&apos;t receive the email? Check your spam folder or{' '}
          {email ? (
            <button type="button" className={styles.textButton} onClick={resend} disabled={state === 'sending'}>
              resend link
            </button>
          ) : (
            <Link href="/forgot-password" className={styles.textButton}>
              resend link
            </Link>
          )}
          .
        </p>
        <div role="status">
          <AnimatePresence>
            {state === 'sent' && (
              <motion.p
                className={styles.status}
                initial={isStatic ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={isStatic ? { duration: 0 } : { duration: durations.base, ease }}
              >
                We’ve sent you a new link.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthScreen>
  )
}
