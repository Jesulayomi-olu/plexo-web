import { useEffect, useState } from 'react'

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
export function useTypewriter(prompts: readonly string[], active: boolean, { startDelay = 600, hold = 1900 }: TypewriterOptions = {}) {
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
          const ch = prompt[c - 1]
          await wait(ch === '.' ? 150 : ch === ' ' ? 75 : 40 + Math.random() * 45)
        }
        setBusy(false)
        await wait(hold)
        setBusy(true)
        for (let c = prompt.length - 1; c >= 0 && !cancelled; c--) {
          setText(prompt.slice(0, c))
          await wait(18)
        }
        setBusy(false)
        await wait(420)
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
