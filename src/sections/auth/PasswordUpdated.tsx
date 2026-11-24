'use client'

import { Button } from '../../components/Button'
import { LOGIN_HREF } from '../navData'
import { AuthScreen, formStyles as styles } from './AuthForm'

/** Password Updated! (Figma 1296:9363): "Return to sign in" opens Welcome Back. */
export default function PasswordUpdated() {
  return (
    <AuthScreen
      title="Password updated!"
      lead="Your password has been changed successfully. You can now log in with your new password."
    >
      <Button href={LOGIN_HREF} size="large" fullWidth className={styles.submit}>
        Return to sign in
      </Button>
    </AuthScreen>
  )
}
