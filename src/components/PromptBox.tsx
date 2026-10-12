import { useId, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { useInView } from 'framer-motion'
import { useStaticMotion } from '../lib/motion'
import { useTypewriter } from '../motion/useTypewriter'
import { Button } from './Button'
import styles from './PromptBox.module.css'

/**
 * Figma "Frame 11" (hero, 234:709) / "Frame 71" (final CTA, 234:2083):
 * the 792×89 prompt box ("Frame 5") plus the helper row under it ("Frame 12").
 */
type PromptBoxProps = {
  className?: string
  /**
   * Typewriter placeholder: types each prompt, holds, deletes, types the next. Stops while the field
   * is focused or filled. Static (Figma placeholder) for reduced motion and capture mode.
   */
  typingPrompts?: readonly string[]
  /** Milliseconds before typing starts (lets an entrance animation finish). */
  typingDelay?: number
}

const PLACEHOLDER = 'Build an online store for my skincare brand...'

export function PromptBox({ className, typingPrompts, typingDelay = 600 }: PromptBoxProps) {
  const uid = useId()
  const inputId = `${uid}-prompt`
  const isStatic = useStaticMotion()
  const boxRef = useRef<HTMLFormElement>(null)
  const inView = useInView(boxRef)
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState('')
  const typing = Boolean(typingPrompts?.length) && !isStatic
  const { text, busy } = useTypewriter(typingPrompts ?? [], typing && inView && !focused && value === '', {
    startDelay: typingDelay,
  })
  const showTyping = typing && !focused && value === ''

  // When the typed text is wider than the field (phones), flag it so the overlay fades its start.
  const typingRef = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const el = typingRef.current
    const inner = el?.firstElementChild as HTMLElement | null
    if (el && inner) el.dataset.overflow = String(inner.offsetWidth > el.clientWidth + 1)
  }, [text, showTyping])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <form ref={boxRef} className={styles.box} onSubmit={handleSubmit}>
        <button type="button" className={styles.attach} aria-label="Attach a file">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <path
              d="M3.54108 8.49992H13.4589M8.49998 3.54102V13.4588"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <label htmlFor={inputId} className="visually-hidden">
          Describe the site you want to build
        </label>
        <span className={styles.field}>
          <input
            id={inputId}
            name="prompt"
            type="text"
            className={styles.input}
            placeholder={typing ? '' : PLACEHOLDER}
            autoComplete="off"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {showTyping && (
            <span ref={typingRef} className={styles.typing} aria-hidden="true">
              <span className={styles.typingText}>
                {text}
                <span className={`${styles.caret} ${busy ? '' : styles.caretBlink}`} />
              </span>
            </span>
          )}
        </span>
        <Button type="submit" variant="primary" className={styles.submit}>
          Build it
        </Button>
      </form>
      <div className={styles.meta}>
        <p className={styles.hint}>
          Prefer to design with existing templates?{' '}
          <a href="#canvas" className={styles.hintLink}>
            Start with a{' '}
            <span className={styles.nowrap}>
              template
              {/* "→" outlined from the Figma text: the Google Fonts subsets of Plus Jakarta Sans omit U+2192. */}
              <svg className={styles.arrow} viewBox="347.1 0 8.9 13" fill="currentColor" aria-hidden="true">
                <path d="M351.053 11L354.545 7.424L354.557 8.036L351.053 4.568H352.289L355.289 7.472V7.988L352.289 11H351.053ZM347.921 8.228V7.328H354.473V8.228H347.921Z" />
              </svg>
            </span>
          </a>
        </p>
        <p className={styles.trial}>{' Free for 14 days. No card.'}</p>
      </div>
    </div>
  )
}
