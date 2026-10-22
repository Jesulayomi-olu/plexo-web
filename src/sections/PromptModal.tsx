'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../components/Button'
import { durations, ease, useStaticMotion } from '../lib/motion'
import { useMediaQuery } from '../lib/useMediaQuery'
import styles from './PromptModal.module.css'

/**
 * Figma "Prompt Modal" (603:17036 / 602:635): opened from a story card's "View Prompt". The card dims
 * (black 20%, the card's r40) and a white 567px dialog (r24, shadow) shows the prompt in a grey block,
 * with "Close" and "Copy". It isn't rendered at all until opened. Closes with ×, "Close", Esc or a
 * click on the dimmed area; focus moves into it and returns to "View Prompt" afterwards.
 * Phones: the card is too narrow, so it opens over the whole screen instead.
 */
type Props = { open: boolean; prompt: string; onClose: () => void }

export function PromptModal({ open, prompt, onClose }: Props) {
  const phone = useMediaQuery('(max-width: 767px)')
  const content = <AnimatePresence>{open && <Dialog prompt={prompt} onClose={onClose} page={phone} />}</AnimatePresence>
  return phone ? createPortal(content, document.body) : content
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older browsers / non-secure pages: copy through a temporary, invisible text field.
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    const ok = document.execCommand('copy')
    field.remove()
    return ok
  }
}

/* Lucide "x" at 16px. */
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Dialog({ prompt, onClose, page }: { prompt: string; onClose: () => void; page: boolean }) {
  const isStatic = useStaticMotion()
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  // Focus moves into the dialog when it opens and back to what opened it when it closes.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialogRef.current?.focus()
    return () => opener?.focus()
  }, [])

  // Esc closes; Tab and Shift+Tab stay inside the dialog.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const dialog = dialogRef.current
      if (!dialog) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'Tab') {
        const items = [...dialog.querySelectorAll<HTMLElement>('button')]
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        if (event.shiftKey && (active === first || active === dialog)) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Phones: the page behind doesn't scroll while the dialog covers it.
  useEffect(() => {
    if (!page) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [page])

  // "Copied" shows for a moment, then the button reads "Copy" again.
  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  const fade = isStatic ? { duration: 0 } : { duration: durations.fast, ease }

  return (
    <div className={`${styles.layer} ${page ? styles.page : ''}`}>
      <motion.div
        className={styles.scrim}
        aria-hidden="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={fade}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={styles.modal}
        initial={isStatic ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={isStatic ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.99 }}
        transition={isStatic ? { duration: 0 } : { duration: 0.22, ease }}
      >
        <div className={styles.header}>
          <h3 id={titleId} className={styles.title}>
            Prompt
          </h3>
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.code}>
          <p>{prompt}</p>
        </div>
        <div className={styles.footer}>
          <Button variant="outline" size="small" className={styles.action} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="small"
            className={styles.action}
            onClick={() => void copyText(prompt).then((ok) => ok && setCopied(true))}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <span className="visually-hidden" role="status">
          {copied ? 'Prompt copied to the clipboard' : ''}
        </span>
      </motion.div>
    </div>
  )
}
