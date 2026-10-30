import styles from './EmailMock.module.css'

/**
 * Email & Marketing hero picture (736:14803): a phone-width email (204×468 at 157, 14; white, 1px
 * #d7d8d3, r20.22, clipped) showing the top of the "SOLA" summer email ("image 11", 201×599 at −1, −29).
 */
export function EmailMock() {
  return (
    <div className={styles.frame}>
      <img src="/assets/features/email/summer-email.webp" width={201} height={599} alt="" className={styles.email} />
    </div>
  )
}
