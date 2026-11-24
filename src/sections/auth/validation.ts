/**
 * Client-side checks for the auth forms. The password rules are the "Password must contain :" checklist
 * of Figma 1296:8405 and 1296:9069; the messages under a field use the field's Error variant
 * (Figma 1066:7610: red border, 12px red text 8 below).
 */

export type PasswordRule = { id: string; label: string; test: (value: string) => boolean }

export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'At least 10 characters', test: (value) => value.length >= 10 },
  { id: 'upper', label: 'An uppercase letter', test: (value) => /\p{Lu}/u.test(value) },
  { id: 'lower', label: 'A lowercase letter', test: (value) => /\p{Ll}/u.test(value) },
  { id: 'number', label: 'A number', test: (value) => /\p{Nd}/u.test(value) },
]

export const meetsPasswordRules = (value: string) => PASSWORD_RULES.every((rule) => rule.test(value))

/** A pragmatic email check (something@something.something, no spaces); the backend has the final say. */
export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

export const messages = {
  // Figma 1296:8070 (log in) and 1296:8606 (passwords don't match). The rest aren't in Figma; they
  // follow the same pattern.
  incorrectLogin: 'Incorrect email or password.',
  mismatch: 'Passwords do not match, please try again.',
  nameRequired: 'Enter your full name.',
  emailRequired: 'Enter your email address.',
  emailInvalid: 'Enter a valid email address, like you@company.com.',
  passwordRules: 'Choose a password that meets every rule below.',
  confirmRequired: 'Re-enter your password.',
} as const

export function emailError(value: string): string | undefined {
  if (!value.trim()) return messages.emailRequired
  if (!isEmail(value)) return messages.emailInvalid
  return undefined
}
