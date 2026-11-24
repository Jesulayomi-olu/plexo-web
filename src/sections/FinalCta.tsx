'use client'

import { useId, useState, type FormEvent } from 'react'
import { SIGNUP_HREF } from './navData'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import styles from './FinalCta.module.css'

/**
 * Figma "Final CTA" (1166:16076, Home page V2 1166:14994): 1440×526, #f5f7ed, padding 100 top/bottom
 * and 80 on the right only (so Figma centres the column in the first 1360px, 40px left of the page
 * centre), column gap 64: the heading ("Frame 57", 569×46) and the 916×216 card ("Frame 5").
 * The card: the one-line prompt field (attach button, field, Primary "Build it"), then "or" and three
 * outline links. Copy is Figma's, with two slips corrected (the design team's call): "Start with  a template"
 * (double space) and "blank Canvas" (capital C).
 */
const links = [
  { label: 'Start with a template', href: '/resources/templates' },
  { label: 'Start from a blank canvas', href: SIGNUP_HREF },
  { label: 'Connect your AI', href: '/features/mcp' },
] as const

export default function FinalCta() {
  const inputId = `${useId()}-prompt`
  const [value, setValue] = useState('')

  // Same as the shared PromptBox: nothing to send the prompt to yet, so the form stops here.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault()

  return (
    <section id="start" data-section="start" className={styles.cta} aria-labelledby="start-title">
      <Reveal className={styles.headingBox}>
        <h2 id="start-title" className={styles.title}>
          Ready to bring your idea to life?
        </h2>
      </Reveal>

      <Reveal delay={0.08} className={styles.card}>
        <form className={styles.prompt} onSubmit={handleSubmit}>
          <div className={styles.lead}>
            <button type="button" className={styles.attach} aria-label="Attach a file">
              <img src="/assets/v3/final-cta/plus.svg" width={17} height={17} alt="" />
            </button>
            <label htmlFor={inputId} className="visually-hidden">
              Describe the site you want to build
            </label>
            <input
              id={inputId}
              name="prompt"
              type="text"
              className={styles.input}
              placeholder="Describe what you have in mind"
              autoComplete="off"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
          <Button type="submit" className={styles.submit}>
            Build it
          </Button>
        </form>

        <div className={styles.alternatives}>
          <p className={styles.or}>or</p>
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
