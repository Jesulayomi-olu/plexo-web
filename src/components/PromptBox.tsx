import { useId, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useInView } from 'framer-motion'
import { useStaticMotion } from '../lib/motion'
import { useTypewriter } from '../motion/useTypewriter'
import { Button } from './Button'
import styles from './PromptBox.module.css'

/**
 * Prompt box (Home page V2).
 * - "default": final CTA "Frame 71" (532:25042) — the 792×89 one-line box ("Frame 5") + helper row.
 * - "hero": hero "Frame 2147239234" (532:24028) — the 993×238 box on the dark hero, a multi-line
 *   prompt area, with a light helper row.
 */
type PromptBoxProps = {
  className?: string
  variant?: 'default' | 'hero'
  /**
   * Typewriter placeholder: types each prompt, holds, deletes, types the next. Stops while the field
   * is focused or filled. Static (Figma placeholder) for reduced motion and capture mode.
   */
  typingPrompts?: readonly string[]
  /** Milliseconds before typing starts (lets an entrance animation finish). */
  typingDelay?: number
}

const PLACEHOLDER = 'Build an online store for my skincare brand...'

/* "Import icon" (191:2406): arrow right, 16×16, 1.5 stroke. */
function ArrowIcon() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.33301 7.99967H12.6663M7.99967 12.6663L12.6663 7.99967L7.99967 3.33301"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PromptBox({ className, variant = 'default', typingPrompts, typingDelay = 600 }: PromptBoxProps) {
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
  const hero = variant === 'hero'

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

  // Multi-line prompt: Enter adds a line, Ctrl/⌘ + Enter sends.
  const onTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) boxRef.current?.requestSubmit()
  }

  const fieldProps = {
    id: inputId,
    name: 'prompt',
    className: styles.input,
    placeholder: typing ? '' : PLACEHOLDER,
    autoComplete: 'off',
    value,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  }

  return (
    <div className={[styles.root, hero && styles.hero, className].filter(Boolean).join(' ')}>
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
          {hero ? (
            <textarea
              {...fieldProps}
              rows={1}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onTextareaKeyDown}
            />
          ) : (
            <input {...fieldProps} type="text" onChange={(event) => setValue(event.target.value)} />
          )}
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
          <a href="#templates" className={styles.hintLink}>
            Start with a{' '}
            <span className={styles.nowrap}>
              template
              <ArrowIcon />
            </span>
          </a>
        </p>
        <p className={styles.trial}>{' Free for 14 days. No card.'}</p>
      </div>
    </div>
  )
}
