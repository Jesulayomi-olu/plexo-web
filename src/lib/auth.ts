/**
 * Auth hooks for the sign-up, log-in and password-reset screens (`src/sections/auth/*`).
 *
 * THERE IS NO AUTH BACKEND YET. These are stubs: the app team wires each one to the real API and keeps
 * the return type, so the forms need no changes. The forms validate their input first, so these only
 * ever receive well-formed values.
 *
 * - `requestPasswordReset` and `resetPassword` resolve successfully, so the reset flow can be clicked
 *   through end to end.
 * - `signUp` and `logIn` don't pretend: they resolve `{ ok: false, error: 'not-connected' }` and the
 *   form simply returns to idle, showing nothing.
 */

export type AuthError =
  /** No backend is wired up yet; the form shows nothing and returns to idle. */
  | 'not-connected'
  /** Log in only: the email or password is wrong (the form shows "Incorrect email or password."). */
  | 'invalid-credentials'

export type AuthResult = { ok: true } | { ok: false; error: AuthError }

/** Where a signed-in user lands. TODO(app): set this to the app's URL once sign-up and log-in work. */
export const APP_HOME_HREF: string | undefined = undefined

const notConnected: AuthResult = { ok: false, error: 'not-connected' }

/** Create an account. TODO(app): call the sign-up endpoint. */
export async function signUp(details: { name: string; email: string; password: string }): Promise<AuthResult> {
  void details
  return notConnected
}

/**
 * Log in with email and password. TODO(app): call the log-in endpoint; return
 * `{ ok: false, error: 'invalid-credentials' }` when the email or password is wrong.
 */
export async function logIn(credentials: { email: string; password: string }): Promise<AuthResult> {
  void credentials
  return notConnected
}

/** "Continue with Google". TODO(app): start the Google OAuth flow. Until then the button does nothing. */
export function continueWithGoogle(): void {}

/**
 * Email a password-reset link ("Send Reset Link", and "Resend link" on Check your Inbox).
 * TODO(app): call the reset endpoint. Resolves successfully for now.
 */
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  void email
  return { ok: true }
}

/**
 * Save a new password ("Save Password"). `token` is the `?token=` of the link in the reset email.
 * TODO(app): call the endpoint that checks the token and saves the password. Resolves successfully for now.
 */
export async function resetPassword(details: { password: string; token?: string }): Promise<AuthResult> {
  void details
  return { ok: true }
}
