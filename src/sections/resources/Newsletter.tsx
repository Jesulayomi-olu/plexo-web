'use client'

import { useId, type FormEvent } from 'react'
import { EmailField } from '../../components/EmailField'
import { Reveal } from '../../components/Reveal'
import styles from './Newsletter.module.css'

/**
 * Resources "Newsletter" (718:8055): #121212, padding 56/80, 182 tall; "Get one tip every week." (600
 * 32/38.4) and its line (16/24), #e8e8e4, beside the footer's email field. Like the footer's, the form
 * checks the address and stops there until a mailing list is connected.
 */
export default function Newsletter() {
  const inputId = useId()
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault()

  return (
    <section data-section="newsletter" className={styles.band} aria-labelledby={`${inputId}-title`}>
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.text}>
          {/* Figma ends the heading with a space; it is left-aligned, so it changes nothing. */}
          <h2 id={`${inputId}-title`} className={styles.title}>
            Get one tip every week.
          </h2>
          <p className={styles.lead}>Short, practical and free. Unsubscribe anytime.</p>
        </Reveal>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor={inputId} className="visually-hidden">
            Your email address
          </label>
          <EmailField id={inputId} />
        </form>
      </div>
    </section>
  )
}
