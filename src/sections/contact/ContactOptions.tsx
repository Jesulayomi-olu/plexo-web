'use client'

import { useId, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import styles from './ContactOptions.module.css'

/**
 * Get in touch "Destinations" (1349:8635): #f4f5f0, padding 80/26, a 291 column of ways to reach the
 * team (24 apart) and the 673-wide message form, 38 apart, centred.
 *
 * Cards (white, 1px #d7d8d3, r16, padding 20, gap 8): a 24px green icon, the title (500 16/24, #232323)
 * and, 8 below, the detail (400 14/21, #5b5b58). "Book a call instead" (#fcfcfa, padding 32/20) is one
 * row: icon, title, chevron. It has no booking link yet, so it is not a link.
 *
 * Form card (white, r12, padding 24, a 10px rgb(69 69 67 / 7%) ring outside): fields in rows of two,
 * 24 apart, then 40 to "Submit" (Primary, full width, 52 tall). Field: label (500 12/13.2, #333332)
 * · 12 · box (46 tall, 1px #d7d8d3, r8, padding 12; 14/21 text, placeholder #7a7b77). Like the
 * newsletter forms, it checks the fields and stops there until the form is connected to an inbox.
 */
type Field = {
  name: string
  label: string
  type: 'text' | 'email' | 'tel'
  autoComplete: string
  placeholder: string
  required?: boolean
}

const fields: Field[] = [
  { name: 'firstName', label: 'First Name', type: 'text', autoComplete: 'given-name', placeholder: 'Enter your first name', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', autoComplete: 'family-name', placeholder: 'Enter your last name' },
  { name: 'email', label: 'Email Address', type: 'email', autoComplete: 'email', placeholder: 'you@company.com', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', autoComplete: 'tel', placeholder: 'Enter your phone number' },
]

export default function ContactOptions() {
  const baseId = useId()
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault()

  return (
    <section data-section="contact" className={styles.section} aria-label="Contact Plexo">
      <div className={styles.inner}>
        <ul className={styles.cards}>
          <Reveal as="li" className={styles.card}>
            <img src="/assets/contact/chat.svg" width={24} height={24} alt="" className={styles.icon} />
            <div className={styles.text}>
              <p className={styles.title}>Chat with Sales</p>
              <a href="mailto:hello@plexopages.com" className={styles.email}>
                hello@plexopages.com
              </a>
            </div>
          </Reveal>
          <Reveal as="li" delay={0.05} className={styles.card}>
            <img src="/assets/contact/phone.svg" width={24} height={24} alt="" className={styles.icon} />
            <div className={styles.text}>
              <p className={styles.title}>Call us</p>
              <a href="tel:07011000211" className={styles.detail}>
                07011000211
              </a>
            </div>
          </Reveal>
          <Reveal as="li" delay={0.1} className={`${styles.card} ${styles.bookCard}`}>
            <img src="/assets/contact/headphones.svg" width={24} height={24} alt="" className={styles.icon} />
            <p className={`${styles.title} ${styles.bookTitle}`}>Book a call instead</p>
            <img src="/assets/contact/chevron-right.svg" width={24} height={24} alt="" className={styles.icon} />
          </Reveal>
        </ul>

        <Reveal delay={0.08} className={styles.formCard}>
          <form className={styles.form} onSubmit={handleSubmit} aria-label="Send us a message">
            <div className={styles.fields}>
              {fields.map((field) => (
                <div key={field.name} className={styles.field}>
                  <label htmlFor={`${baseId}-${field.name}`} className={styles.label}>
                    {field.label}
                  </label>
                  <input
                    id={`${baseId}-${field.name}`}
                    className={styles.input}
                    type={field.type}
                    name={field.name}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    required={field.required}
                    inputMode={field.type === 'tel' ? 'tel' : undefined}
                  />
                </div>
              ))}
              <div className={`${styles.field} ${styles.wide}`}>
                <label htmlFor={`${baseId}-message`} className={styles.label}>
                  Message
                </label>
                <textarea
                  id={`${baseId}-message`}
                  className={`${styles.input} ${styles.message}`}
                  name="message"
                  placeholder="Write a message"
                  rows={1}
                  required
                />
              </div>
            </div>
            <Button type="submit" size="large" fullWidth className={styles.submit}>
              Submit
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
