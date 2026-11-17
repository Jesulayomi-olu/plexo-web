'use client'

import { useInView } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'
import { useStaticMotion } from '../lib/motion'
import { useWordTypewriter } from '../motion/useWordTypewriter'
import styles from './Hero.module.css'

/** The words typed into the hand-drawn box, in order. The first is the Figma text and the server render. */
const WORDS = ['Business', 'Products', 'Services'] as const

/**
 * Near-instant swaps: each word holds 1.5s, then is deleted (12ms a letter) and the next typed (about
 * 26ms a letter), so a change takes about 0.45s and never reads as loading.
 */
const WORD_TIMING = { hold: 1500, typeMs: 26, deleteMs: 12, gapMs: 120 } as const

/**
 * Heading "Frame 2147239485" (1166:15034): "Get Your [Business] Online" / "Without Any Stress".
 * The boxed word types itself out in turn (Business → Products → Services) with the site's typing
 * sequence (useWordTypewriter). The box keeps the width of the word being typed or deleted and eases to
 * the next word's width in the pause between words, so the line moves only once per change.
 * Screen readers get the plain sentence; reduced motion and capture mode show the Figma frame.
 */
export function HeroTitle({ startDelay }: { startDelay: number }) {
  const isStatic = useStaticMotion()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const boxRef = useRef<HTMLSpanElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(titleRef)
  const { text, index, busy } = useWordTypewriter(WORDS, !isStatic && inView, { startDelay, ...WORD_TIMING })

  // Each word's box width: the word itself plus the box's side padding. Measured again when the type
  // size changes (web font loaded, breakpoint, fluid phone size). Until then the box hugs its text.
  const [widths, setWidths] = useState<number[] | null>(null)
  useLayoutEffect(() => {
    const box = boxRef.current
    const measure = measureRef.current
    if (!box || !measure) return
    const update = () => {
      const style = getComputedStyle(box)
      const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
      setWidths([...measure.children].map((word) => word.getBoundingClientRect().width + padding))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(measure)
    return () => observer.disconnect()
  }, [])

  const width = widths?.[index]

  return (
    <h1 ref={titleRef} className={styles.title}>
      <span className={styles.titleLine}>
        <span>Get Your</span>{' '}
        <span ref={boxRef} className={styles.wordBox} style={width ? { width } : undefined}>
          <span className="visually-hidden">{WORDS[0]}</span>
          <span className={styles.typed} aria-hidden="true">
            {text}
            {!isStatic && <span className={`${styles.caret} ${busy ? '' : styles.caretBlink}`} />}
          </span>
          <span className={styles.wordFrame} aria-hidden="true">
            <img src="/assets/v3/hero/word-box.svg" width={211.511} height={63.9609} alt="" />
          </span>
          <span ref={measureRef} className={styles.measure} aria-hidden="true">
            {WORDS.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </span>
        </span>{' '}
        <span>Online</span>
      </span>{' '}
      <span className={styles.titleLine}>Without Any Stress</span>
    </h1>
  )
}
