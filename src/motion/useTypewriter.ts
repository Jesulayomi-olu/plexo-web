import { useEffect, useState } from 'react'

/*
 * The typing sequence shared by every typewriter on the site: type like a person (slightly uneven
 * speed, a beat on spaces, slower dots), hold, delete quickly, a short pause, then the next text.
 */
/** Milliseconds after typing `ch`. */
export const typeDelay = (ch: string) => (ch === '.' ? 150 : ch === ' ' ? 75 : 40 + Math.random() * 45)
/** Milliseconds per deleted character. */
export const DELETE_MS = 18
/** Milliseconds between the last deletion and the next text. */
export const GAP_MS = 420
/** Default milliseconds a finished text stays before it is deleted. */
export const HOLD_MS = 1900

type TypewriterOptions = {
  /** Milliseconds before the first character. */
  startDelay?: number
  /** Milliseconds the finished prompt stays before it is deleted. */
  hold?: number
}

/**
 * Types each prompt character by character like a person (slightly uneven speed, a beat on spaces,
 * slower trailing dots), holds it, deletes it quickly, then moves to the next. Loops while `active`.
 * Returns the visible text and whether characters are currently being typed or deleted.
 */
export function useTypewriter(prompts: readonly string[], active: boolean, { startDelay = 600, hold = HOLD_MS }: TypewriterOptions = {}) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!active || prompts.length === 0) return
    let cancelled = false
    let timer = 0
    const wait = (ms: number) => new Promise<void>((resolve) => {
      timer = window.setTimeout(resolve, ms)
    })

    const run = async () => {
      await wait(startDelay)
      for (let i = 0; !cancelled; i = (i + 1) % prompts.length) {
        const prompt = prompts[i]
        setBusy(true)
        for (let c = 1; c <= prompt.length && !cancelled; c++) {
          setText(prompt.slice(0, c))
          await wait(typeDelay(prompt[c - 1]))
        }
        setBusy(false)
        await wait(hold)
        setBusy(true)
        for (let c = prompt.length - 1; c >= 0 && !cancelled; c--) {
          setText(prompt.slice(0, c))
          await wait(DELETE_MS)
        }
        setBusy(false)
        await wait(GAP_MS)
      }
    }
    void run()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [active, prompts, startDelay, hold])

  return { text, busy }
}
