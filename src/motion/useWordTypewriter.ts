import { useEffect, useRef, useState } from 'react'
import { DELETE_MS, GAP_MS, HOLD_MS, typeDelay } from './useTypewriter'

type Phase = 'hold' | 'delete' | 'gap' | 'type'

type WordTypewriterOptions = {
  /** Milliseconds before the first word's hold starts (lets the entrance animation finish). */
  startDelay?: number
  /** Milliseconds each finished word stays. */
  hold?: number
  /** Milliseconds per typed letter (a little uneven, ±25%). Defaults to the site's human typing pace. */
  typeMs?: number
  /** Milliseconds per deleted letter. */
  deleteMs?: number
  /** Milliseconds between the last deletion and the next word. */
  gapMs?: number
}

/**
 * Cycles through `words` with the site's typing sequence (see useTypewriter): the first word starts
 * fully typed (it is also the server-rendered text), holds, is deleted, then the next word is typed.
 * `index` moves to the next word as soon as the old one is gone, so a frame around the word can resize
 * during the pause before typing starts. Pausing (`active` false) keeps the exact position, and the
 * cycle carries on from there when it resumes.
 */
export function useWordTypewriter(
  words: readonly string[],
  active: boolean,
  { startDelay = 1200, hold = HOLD_MS, typeMs, deleteMs = DELETE_MS, gapMs = GAP_MS }: WordTypewriterOptions = {},
) {
  const [text, setText] = useState(words[0] ?? '')
  const [index, setIndex] = useState(0)
  const [busy, setBusy] = useState(false)
  const state = useRef({ index: 0, length: words[0]?.length ?? 0, phase: 'hold' as Phase, started: false })

  useEffect(() => {
    if (!active || words.length < 2) return
    let cancelled = false
    let timer = 0
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms)
      })
    const s = state.current

    const run = async () => {
      // The first start waits for the entrance; a resume after a pause picks up almost at once.
      await wait(s.started ? 300 : startDelay)
      s.started = true
      while (!cancelled) {
        const word = words[s.index]
        if (s.phase === 'hold') {
          setBusy(false)
          await wait(hold)
          if (cancelled) return
          s.phase = 'delete'
        } else if (s.phase === 'delete') {
          setBusy(true)
          while (s.length > 0) {
            s.length -= 1
            setText(word.slice(0, s.length))
            await wait(deleteMs)
            if (cancelled) return
          }
          s.phase = 'gap'
        } else if (s.phase === 'gap') {
          setBusy(false)
          s.index = (s.index + 1) % words.length
          setIndex(s.index)
          await wait(gapMs)
          if (cancelled) return
          s.phase = 'type'
        } else {
          setBusy(true)
          while (s.length < word.length) {
            s.length += 1
            setText(word.slice(0, s.length))
            await wait(typeMs ? typeMs * (0.75 + Math.random() * 0.5) : typeDelay(word[s.length - 1]))
            if (cancelled) return
          }
          s.phase = 'hold'
        }
      }
    }
    void run()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [active, words, startDelay, hold, typeMs, deleteMs, gapMs])

  return { text, index, busy }
}
