'use client'

import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useInView,
  type TargetAndTransition,
  type Transition,
} from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ease, useStaticMotion } from '../lib/motion'
import styles from './HeroStory.module.css'

/**
 * The hero picture's story, from Figma "Hero storyboard" (1133:16152), animated in the manner of the
 * reference cut the designer shared (a cursor that flies in and clicks, cards that morph from one state to
 * the next, blur-and-motion-blur transitions):
 *   1. 1159:22003  the prompt types itself out
 *   2. 1159:21977  a cursor arrives and clicks "Build"
 *   3. 1159:21924  the box shrinks to "Plexo is thinking..." (a shimmer runs through it)
 *   4. 1162:22062  it morphs into the "Your site is live" card; the cursor clicks "View site"
 *   5. 1162:22112  the card blows out into the site on desktop and phone, with three chips around it
 * then everything sweeps away and the empty prompt comes back. One loop is 9.2s.
 *
 * Everything is laid out on the storyboard's 1280×339 frame (design px) and scaled to the picture.
 * Nothing plays until the visitor reaches the picture (60% of it on screen); from then it starts at once
 * and loops. Once the picture has left the screen it rewinds, so every visit starts from the beginning.
 * Reduced motion and capture mode show frame 1 (the hero as designed in Home page V2).
 */

const PROMPT = 'Build an online store for my skincare brand...'

/** How much of the picture must be on screen before the story starts. */
const START_AMOUNT = 0.6

/** The loop, in ms. */
const T = {
  typeStart: 120,
  typeEach: 26,
  cursorToBuild: 850,
  pressBuild: 1550,
  thinking: 1750,
  live: 3150,
  cursorToView: 4350,
  pressView: 5000,
  showcase: 5200,
  exit: 8400,
  reset: 8750,
  loop: 9200,
} as const
const PRESS_MS = 180

type Scene = 'prompt' | 'thinking' | 'live' | 'showcase' | 'exit'
type Cursor = 'hidden' | 'toBuild' | 'pressBuild' | 'leaveBuild' | 'toView' | 'pressView' | 'leaveView'
type Frame = { scene: Scene; typed: number; cursor: Cursor; reset: boolean }

function frameAt(t: number): Frame {
  const scene: Scene =
    t < T.thinking ? 'prompt' : t < T.live ? 'thinking' : t < T.showcase ? 'live' : t < T.reset ? (t < T.exit ? 'showcase' : 'exit') : 'prompt'
  const reset = t >= T.reset
  const typed = reset || t < T.typeStart ? 0 : Math.min(PROMPT.length, Math.floor((t - T.typeStart) / T.typeEach) + 1)
  const cursor: Cursor =
    t < T.cursorToBuild
      ? 'hidden'
      : t < T.pressBuild
        ? 'toBuild'
        : t < T.pressBuild + PRESS_MS
          ? 'pressBuild'
          : t < T.cursorToView
            ? 'leaveBuild'
            : t < T.pressView
              ? 'toView'
              : t < T.pressView + PRESS_MS
                ? 'pressView'
                : 'leaveView'
  return { scene, typed, cursor, reset }
}

const sameFrame = (a: Frame, b: Frame) => a.scene === b.scene && a.typed === b.typed && a.cursor === b.cursor && a.reset === b.reset

/** The frame shown without motion: storyboard frame 1. */
const STILL: Frame = { scene: 'prompt', typed: PROMPT.length, cursor: 'hidden', reset: false }

/* Snappy ease-out for morphs and arrivals; a quick ease-in for exits. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const
const EASE_IN = [0.55, 0, 1, 0.45] as const
const morph: Transition = { duration: 0.5, ease: EASE_OUT }

/*
 * The frosted frame ("Glass / You type") and the white surface inside it, per state (design px; the glass
 * includes its stroke). Prompt 1193:9946 / 1159:22012, thinking 1159:21931, live 1162:22094 / 1162:22095.
 */
const GLASS = {
  prompt: { width: 690, height: 105.81, borderRadius: 31.337, boxShadow: 'inset 0 0 0 1.567px rgba(255,255,255,0.12)' },
  thinking: { width: 690, height: 89.81, borderRadius: 31.337, boxShadow: 'inset 0 0 0 1.567px rgba(255,255,255,0.12)' },
  live: { width: 429.33, height: 210.5, borderRadius: 17.087, boxShadow: 'inset 0 0 0 0.854px rgba(255,255,255,0.2)' },
} as const
const SURFACE = {
  prompt: { width: 649.26, height: 65.07, borderRadius: 32.535, boxShadow: 'inset 0 0 0 0px rgba(232,232,228,1)' },
  thinking: { width: 649.26, height: 49.07, borderRadius: 24.535, boxShadow: 'inset 0 0 0 0px rgba(232,232,228,1)' },
  live: { width: 403.62, height: 184.79, borderRadius: 14.137, boxShadow: 'inset 0 0 0 0.707px rgba(232,232,228,1)' },
} as const

/*
 * Cursor ("navigation-2", 1159:22001), placed by its tip. On "Build" (frame 2) the tip lands at (907.8, 179.2);
 * on "View site" at the button's centre (772.5, 191.9). It flies in on a curve from below right, a little
 * motion-blurred until it lands.
 */
const flight = (to: [number, number], from: [number, number], via: [number, number]): TargetAndTransition => ({
  x: [from[0], via[0], to[0]],
  y: [from[1], via[1], to[1]],
  opacity: [0, 1, 1],
  scale: 1,
  filter: ['blur(2px)', 'blur(1.2px)', 'blur(0px)'],
  transition: { duration: 0.62, ease: EASE_OUT, times: [0, 0.45, 1] },
})
const press = (at: [number, number]): TargetAndTransition => ({
  x: at[0],
  y: at[1],
  opacity: 1,
  scale: [1, 0.8, 1],
  filter: 'blur(0px)',
  transition: { duration: 0.22, ease: 'easeOut' },
})
const leave = (at: [number, number]): TargetAndTransition => ({
  x: at[0] + 36,
  y: at[1] + 30,
  opacity: 0,
  scale: 1,
  filter: 'blur(2px)',
  transition: { duration: 0.35, ease: EASE_IN },
})
const BUILD_TIP: [number, number] = [907.8, 179.2]
const VIEW_TIP: [number, number] = [772.5, 191.9]
const CURSOR: Record<Cursor, TargetAndTransition> = {
  hidden: { x: 1080, y: 420, opacity: 0, transition: { duration: 0 } },
  toBuild: flight(BUILD_TIP, [1090, 430], [1010, 262]),
  pressBuild: press(BUILD_TIP),
  leaveBuild: leave(BUILD_TIP),
  toView: flight(VIEW_TIP, [1000, 440], [900, 280]),
  pressView: press(VIEW_TIP),
  leaveView: leave(VIEW_TIP),
}

/* Content inside the surface swaps through a quick blur crossfade. */
const swap = {
  initial: { opacity: 0, filter: 'blur(6px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.32, ease: EASE_OUT, delay: 0.12 } },
  exit: { opacity: 0, filter: 'blur(6px)', transition: { duration: 0.18, ease: EASE_IN } },
}

/* Success card pieces arrive in turn (blur to focus, a slight rise). */
const liveItem = (i: number) => ({
  initial: { opacity: 0, y: 6, filter: 'blur(5px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: EASE_OUT, delay: 0.28 + i * 0.07 } },
})

/** Showcase pieces: enter from below / the left, leave in a fast sweep to the left with motion blur. */
const sweepOut = { opacity: 0, x: -90, filter: 'blur(10px)', transition: { duration: 0.32, ease: EASE_IN } }

/* "Card" chips (1131:15672, 1159:21656, 1159:21670): design positions and their entrance order. */
const CHIPS = [
  { label: 'Your domain, your customers', left: 595, top: 30, width: 204, delay: 0.32 },
  { label: 'Live in minutes', left: 239, top: 168, width: 126, delay: 0.44 },
  { label: 'One tool instead of five', left: 1004, top: 137, width: 175, delay: 0.56 },
] as const

/** Scale of the 1280-wide frame: the picture's width, but at least 0.75 on tablets and 0.5 on phones. */
function useStageScale() {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const phone = window.matchMedia('(max-width: 767px)')
    const update = () => {
      const width = el.clientWidth
      if (width) setScale(phone.matches ? 0.5 : Math.max(0.75, Math.min(1, width / 1280)))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    phone.addEventListener('change', update)
    return () => {
      observer.disconnect()
      phone.removeEventListener('change', update)
    }
  }, [])
  return { ref, scale }
}

/**
 * The hero picture (its backdrop and the story). It fades up with the hero's entrance, `delay` seconds after
 * the page loads, or at once if the visitor first scrolls to it later. The story starts once the picture
 * has appeared and the visitor has reached it.
 */
export function HeroPicture({ className, delay, children }: { className?: string; delay: number; children: ReactNode }) {
  const isStatic = useStaticMotion()
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.2 })
  const controls = useAnimationControls()
  const mountedAt = useRef(0)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    mountedAt.current = performance.now()
  }, [])

  useEffect(() => {
    if (isStatic || !seen) return
    // What is left of the entrance delay: none if the picture is first reached after it.
    const wait = Math.max(0, delay * 1000 - (performance.now() - mountedAt.current))
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: wait / 1000 } })
    const timer = window.setTimeout(() => setShown(true), wait + 120)
    return () => window.clearTimeout(timer)
  }, [isStatic, seen, delay, controls])

  if (isStatic) {
    return (
      <div className={className}>
        {children}
        <HeroStory ready={false} />
      </div>
    )
  }

  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 16 }} animate={controls}>
      {children}
      <HeroStory ready={shown} />
    </motion.div>
  )
}

function HeroStory({ ready }: { ready: boolean }) {
  const isStatic = useStaticMotion()
  const { ref, scale } = useStageScale()
  // The visitor has reached the picture (most of it on screen) / some of it is still on screen.
  const reached = useInView(ref, { amount: START_AMOUNT })
  const onScreen = useInView(ref)
  const [active, setActive] = useState(false)
  // It starts when reached and loops until the picture has left the screen entirely; the next visit
  // starts again from the beginning.
  if (ready && reached && !active) setActive(true)
  if (active && !onScreen) setActive(false)
  const [frame, setFrame] = useState<Frame>(() => frameAt(0))
  const clock = useRef(0)
  const playing = !isStatic && active

  // The loop clock. When the story stops (the picture has left the screen), it rewinds to the start.
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      clock.current = (clock.current + Math.min(64, now - last)) % T.loop
      last = now
      const next = frameAt(clock.current)
      setFrame((current) => (sameFrame(current, next) ? current : next))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clock.current = 0
      setFrame(frameAt(0))
    }
  }, [playing])

  const f = isStatic ? STILL : frame
  const boxState = f.scene === 'thinking' ? 'thinking' : f.scene === 'live' ? 'live' : 'prompt'
  const showBox = f.scene === 'prompt' || f.scene === 'thinking' || f.scene === 'live'
  const pressingBuild = f.cursor === 'pressBuild'
  const pressingView = f.cursor === 'pressView'

  return (
    <div ref={ref} className={styles.root} data-playing={playing || undefined}>
      <div
        className={styles.stage}
        style={{ transform: `translateX(-50%) scale(${scale ?? 1})`, visibility: scale === null ? 'hidden' : undefined }}
        aria-hidden="true"
      >
        {/* Frames 1–4: the frosted box, morphing from prompt to "thinking" to the success card. */}
        <div className={styles.center}>
          <AnimatePresence>
            {showBox && (
              <motion.div
                key="glass"
                className={styles.glass}
                initial={isStatic ? false : { ...GLASS.prompt, opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                animate={{ ...GLASS[boxState], opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)', transition: { duration: 0.3, ease: EASE_IN } }}
                transition={isStatic ? { duration: 0 } : { ...morph, opacity: { duration: 0.35 }, filter: { duration: 0.35 } }}
              >
                <motion.div
                  className={styles.surface}
                  initial={false}
                  animate={SURFACE[boxState]}
                  transition={isStatic ? { duration: 0 } : morph}
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    {boxState === 'prompt' && (
                      <motion.div key="prompt" className={styles.field} {...swap}>
                        <motion.span className={styles.attach} animate={{ opacity: pressingBuild ? 0.45 : 1 }}>
                          <img src="/assets/v3/hero/icon-plus.svg" width={17.7778} height={17.7778} alt="" />
                        </motion.span>
                        <motion.span className={styles.text} animate={{ opacity: pressingBuild ? 0.45 : 1 }}>
                          {PROMPT.slice(0, f.typed)}
                          {!isStatic && <span className={`${styles.caret} ${f.typed === 0 || f.typed === PROMPT.length ? styles.caretBlink : ''}`} />}
                        </motion.span>
                        <motion.span
                          className={styles.build}
                          animate={{ scale: pressingBuild ? 0.92 : 1, backgroundColor: pressingBuild ? '#365811' : '#1d3509' }}
                          transition={{ duration: 0.16 }}
                        >
                          Build
                        </motion.span>
                      </motion.div>
                    )}
                    {boxState === 'thinking' && (
                      <motion.div key="thinking" className={styles.field} {...swap}>
                        <span className={styles.thinking}>Plexo is thinking...</span>
                      </motion.div>
                    )}
                    {boxState === 'live' && (
                      <motion.div key="live" className={styles.live} {...swap}>
                        <motion.div className={styles.liveHead} {...liveItem(0)}>
                          <motion.span
                            className={styles.check}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 520, damping: 18, delay: 0.3 }}
                          >
                            <img src="/assets/v3/hero/story/check.svg" width={12} height={12} alt="" />
                          </motion.span>
                          <span className={styles.liveTitle}>Your site is live</span>
                        </motion.div>
                        <motion.p className={styles.liveBody} {...liveItem(1)}>
                          Your website is published and hosted with Plexo. It&apos;s ready for the world to see.
                        </motion.p>
                        <motion.div className={styles.liveRow} {...liveItem(2)}>
                          <span className={styles.liveAddress}>Verdantlab.plexopages.com</span>
                          <motion.span
                            className={styles.viewSite}
                            animate={{ scale: pressingView ? 0.9 : 1, backgroundColor: pressingView ? '#365811' : '#1d3509' }}
                            transition={{ duration: 0.16 }}
                          >
                            View site
                          </motion.span>
                        </motion.div>
                        <motion.p className={styles.liveNote} {...liveItem(3)}>
                          You can connect your own domain whenever you&apos;re ready, and keep editing and managing your website
                          as your business grows.
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Frame 5: the site on desktop and phone, with the chips around it. */}
        <AnimatePresence>
          {f.scene === 'showcase' &&
            CHIPS.map((chip, i) => (
              <motion.div
                key={chip.label}
                className={styles.chip}
                style={{ left: chip.left, top: chip.top, width: chip.width }}
                initial={{ opacity: 0, scale: 0.8, y: 10, filter: 'blur(6px)' }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { type: 'spring', stiffness: 420, damping: 26, delay: chip.delay, filter: { duration: 0.3, delay: chip.delay } },
                }}
                exit={sweepOut}
              >
                <span className={styles.chipFloat} style={{ animationDelay: `${-i * 1.15}s` }}>
                  {chip.label}
                </span>
              </motion.div>
            ))}
          {f.scene === 'showcase' && (
            <motion.div
              key="window"
              className={styles.window}
              initial={{ opacity: 0, y: 70, scale: 0.94, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT, delay: 0.05 } }}
              exit={sweepOut}
            >
              <img src="/assets/v3/hero/story/browser-bar.svg" width={485} height={16} alt="" />
              <img className={styles.windowShot} src="/assets/v3/hero/story/site-desktop.webp" width={485} height={282.92} alt="" />
            </motion.div>
          )}
          {f.scene === 'showcase' && (
            <motion.img
              key="phone"
              className={styles.phone}
              src="/assets/v3/hero/story/site-mobile.webp"
              width={168.5}
              height={218}
              alt=""
              initial={{ opacity: 0, x: -80, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE_OUT, delay: 0.18 } }}
              exit={sweepOut}
            />
          )}
        </AnimatePresence>

        {!isStatic && (
          <motion.div className={styles.cursor} initial={{ x: 1080, y: 420, opacity: 0 }} animate={CURSOR[f.cursor]}>
            <span className={styles.cursorIcon}>
              <img src="/assets/v3/hero/story/cursor.svg" width={37.7444} height={37.7444} alt="" />
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
