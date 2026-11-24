'use client'

import { motion, useInView, type Transition, type Variants } from 'framer-motion'
import { useEffect, useState, type CSSProperties } from 'react'
import { Reveal } from '../../components/Reveal'
import { useStaticMotion } from '../../lib/motion'
import { useFitScale } from '../../lib/useFitScale'
import styles from './Campaign.module.css'

/**
 * Email & Marketing "Campaign section · new" (779:16650): #fcfcfa, 1440×1019. The header (eyebrow
 * "One prompt, whole campaign", "Launch the whole campaign.", a 560-wide lead) at y 67, 5.5px left of
 * centre as in Figma; the 765×694 panel at y 268 (#1d3509 with the lime line pattern under a 20% black
 * wash, r16): glass cards for the prompt you type, Plexo's reply and the three results (page, email,
 * reminder), joined by dashed connectors. Built in HTML at Figma's positions; from 768 to 845 the panel
 * scales down, and phones get the same cards as a column.
 *
 * Motion (a sequence, ~4s): once most of the panel is on screen, your message drops in and types itself
 * out; a dashed line draws down to Plexo, whose reply drops in and writes its two lines; then lines draw
 * out to the results, and the page, the email and the reminder drop in one after another, each ticking
 * its check. Once the panel has left the screen it rewinds, so the next visit plays it from the start.
 * Reduced motion and capture mode: the finished diagram.
 */
const results = [
  { key: 'page', label: 'Page', icon: { src: 'shopping-bag', w: 10.2, h: 11.2, x: 0.9, y: 0.4 } },
  { key: 'email', label: 'Email', icon: { src: 'mail-small', w: 11.2002, h: 9.2, x: 0.4, y: 1.4 } },
  { key: 'reminder', label: 'Reminder', icon: { src: 'alarm-clock', w: 11.2, h: 10.2, x: 0.4, y: 0.9 } },
] as const

const PROMPT = 'Black Friday. 30% off. Ends Sunday.'

/** The sequence, in seconds from the start. */
const AT = {
  you: 0,
  cursor: 0.35,
  typeStart: 0.5,
  typeEach: 0.032,
  toReply: 1.75,
  reply: 2.05,
  replyLines: 2.35,
  toResults: 2.8,
  results: [3.15, 3.3, 3.45],
  checkAfter: 0.35,
} as const

/** How much of the panel must be on screen before the sequence starts. */
const START_AMOUNT = 0.4

const asset = (name: string) => `/assets/features/email/${name}`

/*
 * Three states: hidden (applied at once; the rewind happens off screen), shown (the sequence), and still
 * (the finished diagram at once, for reduced motion and capture mode, which are only known after load).
 */
const instant: Transition = { duration: 0 }
const spring = (delay: number): Transition => ({
  delay,
  type: 'spring',
  stiffness: 380,
  damping: 26,
  opacity: { delay, duration: 0.3 },
})

/** A card drops into place from above. */
const drop = (delay: number, from = -32): Variants => ({
  hidden: { opacity: 0, y: from, scale: 0.97, transition: instant },
  shown: { opacity: 1, y: 0, scale: 1, transition: spring(delay) },
  still: { opacity: 1, y: 0, scale: 1, transition: instant },
})

/** A dashed connector draws itself from its top end down. */
const draw = (delay: number, duration = 0.45): Variants => ({
  hidden: { clipPath: 'inset(0% 0% 100% 0%)', transition: instant },
  shown: { clipPath: 'inset(0% 0% 0% 0%)', transition: { delay, duration, ease: 'easeInOut' } },
  still: { clipPath: 'inset(0% 0% 0% 0%)', transition: instant },
})

/** Plexo's reply lines write themselves from the left. */
const write = (delay: number): Variants => ({
  hidden: { scaleX: 0, transition: instant },
  shown: { scaleX: 1, transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  still: { scaleX: 1, transition: instant },
})

/** The cursor and the "ready" checks pop in. */
const pop = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0, transition: instant },
  shown: { opacity: 1, scale: 1, transition: { delay, type: 'spring', stiffness: 520, damping: 18 } },
  still: { opacity: 1, scale: 1, transition: instant },
})

const fade = (delay: number): Variants => ({
  hidden: { opacity: 0, transition: instant },
  shown: { opacity: 1, transition: { delay, duration: 0.4 } },
  still: { opacity: 1, transition: instant },
})

export default function Campaign() {
  const isStatic = useStaticMotion()
  const { ref, scale, fitted } = useFitScale<HTMLDivElement>(765, 768)
  const reached = useInView(ref, { amount: START_AMOUNT })
  const onScreen = useInView(ref)

  // Plays once the visitor reaches the panel; rewinds once it has left the screen entirely.
  const [playing, setPlaying] = useState(false)
  if (!isStatic && reached && !playing) setPlaying(true)
  if (playing && !onScreen) setPlaying(false)

  // The prompt types itself out after the card lands.
  const [typed, setTyped] = useState(0)
  useEffect(() => {
    if (!playing) return
    let count = 0
    let timer = window.setTimeout(function tick() {
      count += 1
      setTyped(count)
      if (count < PROMPT.length) timer = window.setTimeout(tick, AT.typeEach * 1000)
    }, AT.typeStart * 1000)
    return () => {
      window.clearTimeout(timer)
      setTyped(0)
    }
  }, [playing])

  const state = isStatic ? 'still' : playing ? 'shown' : 'hidden'
  const text = isStatic ? PROMPT : PROMPT.slice(0, typed)
  const typing = !isStatic && typed > 0 && typed < PROMPT.length

  return (
    <section id="campaign" data-section="campaign" className={styles.section} aria-labelledby="campaign-title">
      <div className="container">
        <Reveal className={styles.header}>
          <p className={styles.eyebrow}>One prompt, whole campaign</p>
          {/* Figma ends the heading with a space, which counts when centring. */}
          <h2 id="campaign-title" className={styles.title}>
            Launch the whole campaign.&nbsp;
          </h2>
          <p className={styles.lead}>
            Tell Plexo what you&apos;re promoting. It helps you put together the pages and emails you need to get your offer out
            there.
          </p>
        </Reveal>

        <Reveal delay={0.1} y={20}>
          <motion.div
            ref={ref}
            className={styles.fit}
            style={{ '--s': fitted ? scale : 1 } as CSSProperties}
            role="img"
            aria-label="You type “Black Friday. 30% off. Ends Sunday.” Plexo replies and sets up a sale page, an email and a reminder."
            initial={false}
            animate={state}
          >
            <div className={styles.panel}>
              {/* Dashed connectors, exported from Figma: this one under the cards, the other three over them. */}
              <motion.img
                className={`${styles.connector} ${styles.toEmail}`}
                src={asset('connector-results.svg')}
                width={1}
                height={32}
                alt=""
                variants={draw(AT.toResults, 0.3)}
              />

              {/* "Glass / You type" */}
              <motion.div className={`${styles.glass} ${styles.you}`} variants={drop(AT.you, -40)}>
                <div className={styles.youCard}>
                  <span className={styles.avatarSlot}>
                    <img className={styles.avatar} src={asset('avatar.webp')} width={43} height={43} alt="" />
                  </span>
                  <p className={styles.prompt}>
                    {text}
                    {typing && <span className={styles.caret} />}
                  </p>
                </div>
                <motion.span className={styles.cursor} variants={pop(AT.cursor)}>
                  <span className={styles.pointer}>
                    <img src={asset('navigation.svg')} width={20.7273} height={20.7273} alt="" />
                  </span>
                  <span className={styles.youTag}>You</span>
                </motion.span>
              </motion.div>

              {/* "Glass / Sol reply" */}
              <motion.div className={`${styles.glass} ${styles.reply}`} variants={drop(AT.reply)}>
                <div className={styles.replyCard}>
                  <span className={styles.logoTile}>
                    <img src={asset('plexo-mark.svg')} width={29.8121} height={31.5758} alt="" />
                  </span>
                  <span className={styles.replyLines}>
                    <motion.i variants={write(AT.replyLines)} />
                    <motion.i variants={write(AT.replyLines + 0.12)} />
                  </span>
                </div>
              </motion.div>

              {/* "Glass / Result 1–3" */}
              <div className={styles.results}>
                {/* Phones: the dashed line from Plexo's card branching down to each result. */}
                <motion.span className={styles.branch} aria-hidden="true" variants={fade(AT.toResults)}>
                  <i />
                  <i />
                  <i />
                </motion.span>
                {results.map((r, i) => (
                  <motion.div
                    key={r.key}
                    className={`${styles.glass} ${styles.result} ${styles[r.key]}`}
                    variants={drop(AT.results[i], -28)}
                  >
                    <div className={styles.resultCard}>
                      <span className={styles.preview}>
                        <span className={styles.previewIcon}>
                          <img src={asset(`${r.icon.src}.svg`)} width={r.icon.w} height={r.icon.h} alt="" style={{ left: r.icon.x, top: r.icon.y }} />
                        </span>
                        {r.label}
                      </span>
                      <motion.span className={styles.ready} variants={pop(AT.results[i] + AT.checkAfter)}>
                        <span className={styles.check}>
                          <img src={asset('check.svg')} width={7.174} height={7.174} alt="" />
                        </span>
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.img
                className={`${styles.connector} ${styles.toReply}`}
                src={asset('connector-reply.svg')}
                width={10}
                height={100.911}
                alt=""
                variants={draw(AT.toReply)}
              />
              <motion.img
                className={`${styles.connector} ${styles.toPage}`}
                src={asset('connector-page.svg')}
                width={52.682}
                height={159.5}
                alt=""
                variants={draw(AT.toResults, 0.5)}
              />
              <motion.img
                className={`${styles.connector} ${styles.toReminder}`}
                src={asset('connector-reminder.svg')}
                width={63.182}
                height={162}
                alt=""
                variants={draw(AT.toResults, 0.5)}
              />
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
