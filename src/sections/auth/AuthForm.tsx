'use client'

import { useState, type CSSProperties, type ReactNode, type Ref } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../../components/Button'
import { continueWithGoogle } from '../../lib/auth'
import { durations, ease, useStaticMotion } from '../../lib/motion'
import { PASSWORD_RULES } from './validation'
import styles from './AuthForm.module.css'

/** Shared pieces of the auth forms; see AuthForm.module.css for the Figma measurements. */
export { styles as formStyles }

/** Height + opacity in and out, for messages and the password checklist. */
function useFold() {
  const isStatic = useStaticMotion()
  return {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: isStatic ? { duration: 0 } : { duration: durations.base, ease },
  }
}

/**
 * One screen of the form column: the title (and lead, if any), then the body, 40 apart. Both fade up
 * into place when the screen opens (the body 0.08s after the header).
 */
export function AuthScreen({
  title,
  lead,
  tight = false,
  children,
}: {
  title: string
  lead?: ReactNode
  /** Title and lead 12 apart instead of 16 (Reset password, 1296:8968). */
  tight?: boolean
  children: ReactNode
}) {
  const isStatic = useStaticMotion()
  // The same starting state on the server and the client (so hydration matches); static (reduced
  // motion, capture mode) just gets there at once.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: isStatic ? { duration: 0 } : { duration: durations.slow, ease, delay },
  })

  return (
    <div className={styles.screen}>
      <motion.div className={`${styles.head} ${tight ? styles.headTight : ''}`} {...rise(0)}>
        <h1 className={styles.title}>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
      </motion.div>
      <motion.div {...rise(0.08)}>{children}</motion.div>
    </div>
  )
}

/** "Continue with Google": shown as in Figma; it does nothing until Google sign-in is connected. */
export function GoogleButton() {
  return (
    <button type="button" className={styles.google} onClick={continueWithGoogle}>
      <span className={styles.googleIcon} aria-hidden="true">
        <span className={styles.googleMask}>
          <img src="/assets/auth/google-g.svg" width={20.3402} height={20.6856} alt="" />
        </span>
      </span>
      Continue with Google
    </button>
  )
}

export function OrDivider() {
  return <p className={styles.or}>or</p>
}

type TextFieldProps = {
  id: string
  label: string
  /** Words only screen readers hear after the label, to tell apart two fields with the same label. */
  labelExtra?: string
  type: 'text' | 'email' | 'password'
  name: string
  autoComplete: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  /** Shown under the field, in red, and announced. */
  error?: string
  /** Red border without a message of its own (the message is under another field). */
  invalid?: boolean
  /** Ids of other elements that describe the field (another field's message, the checklist). */
  describedBy?: string
  /** A link at the end of the label row ("Forgot password?"). */
  trailing?: ReactNode
  inputRef?: Ref<HTMLInputElement>
  /** Shown below the field and its message (the password checklist). */
  children?: ReactNode
}

/** Figma's input field (component 1066:7419, Error variant 1066:7610), with show / hide for passwords. */
export function TextField({
  id,
  label,
  labelExtra,
  type,
  name,
  autoComplete,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  invalid,
  describedBy,
  trailing,
  inputRef,
  children,
}: TextFieldProps) {
  const [shown, setShown] = useState(false)
  const fold = useFold()
  const isPassword = type === 'password'
  const errorId = `${id}-error`
  const describers = [error ? errorId : undefined, describedBy].filter(Boolean).join(' ') || undefined
  const isInvalid = Boolean(error) || Boolean(invalid)

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {labelExtra && <span className="visually-hidden">{labelExtra}</span>}
        </label>
        {trailing}
      </div>
      <div className={`${styles.box} ${isInvalid ? styles.boxInvalid : ''}`}>
        <input
          ref={inputRef}
          id={id}
          className={`${styles.input} ${isPassword && !shown && value ? styles.masked : ''}`}
          type={isPassword && shown ? 'text' : type}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describers}
          spellCheck={type === 'text' ? undefined : false}
          autoCapitalize={type === 'email' || isPassword ? 'none' : undefined}
          inputMode={type === 'email' ? 'email' : undefined}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.eye}
            aria-label={shown ? 'Hide password' : 'Show password'}
            aria-pressed={shown}
            aria-controls={id}
            onClick={() => setShown((value) => !value)}
          >
            <img className={styles.eyeOpen} src="/assets/auth/eye.svg" width={18.1675} height={13.1656} alt="" />
            <img className={styles.eyeShut} src="/assets/auth/eye-off.svg" width={20} height={20} alt="" />
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.div key="error" className={styles.reveal} {...fold}>
            <p id={errorId} className={styles.message} role="alert">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  )
}

/** "Forgot password?" in the password label row. */
export function TrailingLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={styles.trailing}>
      {children}
    </Link>
  )
}

/**
 * "Password must contain :" (Figma 1296:8558): each rule turns green as the password meets it. Folds in
 * and out; `gap` is the space above it (12 on Create Account, 16 on Create new password).
 */
export function PasswordRules({ id, value, open, gap = 12 }: { id: string; value: string; open: boolean; gap?: 12 | 16 }) {
  const fold = useFold()
  const titleId = `${id}-title`

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div key="rules" className={styles.reveal} {...fold}>
          <div id={id} className={styles.rules} style={gap === 16 ? ({ '--rules-gap': '16px' } as CSSProperties) : undefined}>
            <p id={titleId} className={styles.rulesTitle}>
              Password must contain:
            </p>
            <ul className={styles.ruleList} aria-labelledby={titleId}>
              {PASSWORD_RULES.map((rule) => {
                const met = rule.test(value)
                return (
                  <li key={rule.id} className={`${styles.rule} ${met ? styles.ruleMet : ''}`}>
                    <span className={styles.ruleIcon} aria-hidden="true">
                      <img className={styles.checkOff} src="/assets/auth/check.svg" width={11} height={11} alt="" />
                      <img className={styles.checkMet} src="/assets/auth/check-met.svg" width={11} height={11} alt="" />
                    </span>
                    {rule.label}
                    <span className="visually-hidden">{met ? ' (done)' : ' (not yet)'}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** The form's main button ("Button / Start free" in Figma): Primary, full width, 52 tall. */
export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <Button type="submit" size="large" fullWidth className={styles.submit}>
      {children}
    </Button>
  )
}

/** "Don’t have an account? Create one free" / "Already have an account? Log in". */
export function SwitchLine({ text, link, href }: { text: string; link: string; href: string }) {
  return (
    <p className={styles.switch}>
      {text} <Link href={href}>{link}</Link>
    </p>
  )
}
