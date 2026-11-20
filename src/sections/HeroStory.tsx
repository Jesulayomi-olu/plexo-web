'use client'

import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useInView,
  type TargetAndTransition,
  type Transition,
} from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
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
 *   5. 1162:22112  the card blows out into the site on desktop and phone, with three chips (icon + label)
 *                  around it (revised November 2026: the chips gained icons, new screenshots)
 * then everything sweeps away and the empty prompt comes back. One loop is 9.2s.
 *
 * Everything is laid out on the storyboard's 1280×339 frame (design px) and sized to the picture with CSS
 * `zoom`, so text and screenshots are drawn at their real size (crisp) rather than scaled as a bitmap.
 * Where the picture is narrower than the 1280 frame (tablets), the chips are pulled in so they always
 * show whole (`chipSpots`). Phones get their own arrangement of the same scenes (`PHONE`), drawn larger
 * than a shrunk desktop frame would allow: a narrower prompt that wraps onto two lines, a taller frame
 * with the chips in two rows above the devices (they never cover a screen) and larger chip labels.
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
 * Once a blur has resolved, the filter is removed altogether: a lingering `blur(0px)` still makes the
 * browser draw the element through a filter layer, which softens text and images.
 */
const sharpen = { filter: 'none' } as const

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

type Pt = [number, number]

/*
 * Phones (below 768px): the frame is drawn at `PHONE.view` design px across the picture (at most 0.8),
 * so a 390 phone shows it at about 0.76 instead of half size, and centred top to bottom in the 169.5-tall
 * picture (HeroStory.module.css: the frame's boxes area is `PHONE.shift` taller, 382.8, so the boxes stay
 * centred on it). The prompt box is 424 wide and its text wraps onto two lines (the pill grows to 72); the
 * "thinking" pill is as wide; the success card keeps its size and fits the picture's height. The last
 * scene has its own phone layout (`PHONE_SHOW`).
 */
const PHONE = {
  view: 460,
  maxScale: 0.8,
  shift: 29,
  glass: {
    prompt: { ...GLASS.prompt, width: 424, height: 112.74 },
    thinking: { ...GLASS.thinking, width: 424 },
    live: GLASS.live,
  },
  surface: {
    prompt: { ...SURFACE.prompt, width: 383.26, height: 72, borderRadius: 36 },
    thinking: { ...SURFACE.thinking, width: 383.26 },
    live: SURFACE.live,
  },
} as const

/*
 * Cursor ("navigation-2", 1159:22001), placed by its tip. On "Build" (frame 2) the tip lands at (907.8, 179.2);
 * on "View site" at the button's centre (772.5, 191.9). It flies in on a curve from below right, a little
 * motion-blurred until it lands. On phones the same paths are taken to the buttons' phone positions: "Build"
 * sits at the end of the narrower pill, and both boxes are centred PHONE.shift / 2 lower.
 */
const flight = (to: Pt, from: Pt, via: Pt): TargetAndTransition => ({
  x: [from[0], via[0], to[0]],
  y: [from[1], via[1], to[1]],
  opacity: [0, 1, 1],
  scale: 1,
  filter: ['blur(2px)', 'blur(1.2px)', 'blur(0px)'],
  transition: { duration: 0.62, ease: EASE_OUT, times: [0, 0.45, 1] },
  transitionEnd: sharpen,
})
const press = (at: Pt): TargetAndTransition => ({
  x: at[0],
  y: at[1],
  opacity: 1,
  scale: [1, 0.8, 1],
  filter: 'blur(0px)',
  transition: { duration: 0.22, ease: 'easeOut' },
  transitionEnd: sharpen,
})
const leave = (at: Pt): TargetAndTransition => ({
  x: at[0] + 36,
  y: at[1] + 30,
  opacity: 0,
  scale: 1,
  filter: 'blur(2px)',
  transition: { duration: 0.35, ease: EASE_IN },
})
const offset = (at: Pt, dx: number, dy: number): Pt => [at[0] + dx, at[1] + dy]
/** The cursor's states for a given "Build" and "View site" tip; the paths keep the design's offsets. */
function cursorStates(build: Pt, view: Pt): Record<Cursor, TargetAndTransition> {
  const start = offset(build, 172.2, 240.8)
  return {
    hidden: { x: start[0], y: start[1], opacity: 0, transition: { duration: 0 } },
    toBuild: flight(build, offset(build, 182.2, 250.8), offset(build, 102.2, 82.8)),
    pressBuild: press(build),
    leaveBuild: leave(build),
    toView: flight(view, offset(view, 227.5, 248.1), offset(view, 127.5, 88.1)),
    pressView: press(view),
    leaveView: leave(view),
  }
}
const BUILD_TIP: Pt = [907.8, 179.2]
const VIEW_TIP: Pt = [772.5, 191.9]
const CURSOR = cursorStates(BUILD_TIP, VIEW_TIP)
/*
 * Phones: "Build" is 6.15 left of the narrower pill's button centre (640 + 383.26 / 2 − 14.67 − 36.01), as on
 * the desktop pill; both tips sit PHONE.shift / 2 lower with the boxes.
 */
const PHONE_CURSOR = cursorStates([774.8, BUILD_TIP[1] + PHONE.shift / 2], [VIEW_TIP[0], VIEW_TIP[1] + PHONE.shift / 2])

/* Content inside the surface swaps through a quick blur crossfade. */
const swap = {
  initial: { opacity: 0, filter: 'blur(6px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.32, ease: EASE_OUT, delay: 0.12 }, transitionEnd: sharpen },
  exit: { opacity: 0, filter: 'blur(6px)', transition: { duration: 0.18, ease: EASE_IN } },
}

/* Success card pieces arrive in turn (blur to focus, a slight rise). */
const liveItem = (i: number) => ({
  initial: { opacity: 0, y: 6, filter: 'blur(5px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: EASE_OUT, delay: 0.28 + i * 0.07 },
    transitionEnd: sharpen,
  },
})

/** Showcase pieces: enter from below / the left, leave in a fast sweep to the left with motion blur. */
const sweepOut = { opacity: 0, x: -90, filter: 'blur(10px)', transition: { duration: 0.32, ease: EASE_IN } }

/*
 * Frame 5's screenshots, built from Figma's source images at 2× and 3× of their size in the frame and
 * clipped at the frame's bottom edge as in Figma. The browser picks one for the size they are shown at.
 * - "Homepage · Desktop@2x (1) 1" (1162:22152): 485×282.92 in the window, 245 of it inside the frame.
 * - "iPhone-13-Pro-Front" (1162:22153, frame "Blue" + the masked "Homepage · Mobile@2x 1"): 168.36 wide,
 *   218 of it inside the frame (the shot covers 168.5, Figma's export box).
 */
const SHOTS = {
  desktop: {
    src: '/assets/v3/hero/story/showcase-desktop@2x.webp',
    srcSet: '/assets/v3/hero/story/showcase-desktop@2x.webp 970w, /assets/v3/hero/story/showcase-desktop@3x.webp 1455w',
    width: 485,
    height: 245,
  },
  phone: {
    src: '/assets/v3/hero/story/showcase-phone@2x.webp',
    srcSet: '/assets/v3/hero/story/showcase-phone@2x.webp 337w, /assets/v3/hero/story/showcase-phone@3x.webp 506w',
    width: 168.5,
    height: 218,
  },
} as const
/** The `sizes` of a screenshot: its design width at the stage's scale. */
const shotSizes = (width: number, scale: number) => `${Math.ceil(width * scale)}px`

/*
 * "Card" chips (1159:21670, 1131:15672, 1159:21656): white pills, an icon tile and the label; design
 * positions and their entrance order. Each icon sits in a 14.4 box where Figma places it ("Globe icon"
 * layers: the globe and clock 13.2 at 0.6, the box 12.59×12.6 at 1.22, 0.6). "Your domain, your
 * customers" has a fixed 152-wide label.
 */
const CHIPS = [
  {
    id: 'domain',
    label: 'Your domain, your customers',
    left: 595,
    top: 30,
    width: 204,
    textWidth: 152,
    icon: { src: '/assets/v3/hero/story/chip-globe.svg', width: 13.2, height: 13.2, left: 0.6, top: 0.6 },
    delay: 0.32,
  },
  {
    id: 'live',
    label: 'Live in minutes',
    left: 239,
    top: 168,
    width: 126,
    textWidth: undefined,
    icon: { src: '/assets/v3/hero/story/chip-clock.svg', width: 13.2, height: 13.2, left: 0.6, top: 0.6 },
    delay: 0.44,
  },
  {
    id: 'tool',
    label: 'One tool instead of five',
    left: 1004,
    top: 137,
    width: 175,
    textWidth: undefined,
    icon: { src: '/assets/v3/hero/story/chip-box.svg', width: 12.5855, height: 12.6003, left: 1.2216, top: 0.6003 },
    delay: 0.56,
  },
] as const
type ChipId = (typeof CHIPS)[number]['id']
type Spot = { left: number; top: number }

const CHIP_HEIGHT = 38
/** Space kept clear between a chip and the picture's side edges, in screen px. */
const CHIP_EDGE = 12
/*
 * The devices' boxes on the frame (design px): "Desktop window" 1162:22147 and the phone 1162:22153
 * (its screen starts 9.4 in, behind the bezel).
 */
const WINDOW_BOX = { left: 464, right: 950, top: 77 }
const PHONE_BOX = { left: 405, top: 121, bezel: 10 }

/**
 * Where the chips go when only design x `lo`…`hi` of the frame is visible (the picture is narrower than
 * the scaled frame on tablets and phones). In the design's own spot when it fits; otherwise pulled in
 * from the edge, overlapping the device beside it a little (chips sit above the devices): "Live in
 * minutes" may cover the phone's bezel but not its screen, "One tool instead of five" up to a third of
 * its width (the window's side margin and the edge of the product card). Pulled in further, a chip
 * moves above the devices instead: "One tool instead of five" joins "Your domain, your customers" in a
 * row over the window, "Live in minutes" sits just above the phone, left of the window.
 */
function chipSpots(lo: number, hi: number): Record<ChipId, Spot> {
  const fit = (left: number, width: number) => Math.min(Math.max(left, lo), hi - width)
  const [domain, live, tool] = CHIPS
  const spots: Record<ChipId, Spot> = {
    domain: { left: fit(domain.left, domain.width), top: domain.top },
    live: { left: fit(live.left, live.width), top: live.top },
    tool: { left: fit(tool.left, tool.width), top: tool.top },
  }
  if (spots.live.left + live.width - PHONE_BOX.left > PHONE_BOX.bezel) {
    spots.live = { left: fit(WINDOW_BOX.left - 8 - live.width, live.width), top: PHONE_BOX.top - 4 - CHIP_HEIGHT }
  }
  if (WINDOW_BOX.right - spots.tool.left > tool.width / 3) {
    const gap = 16
    const row = domain.width + gap + tool.width
    const start = fit((WINDOW_BOX.left + WINDOW_BOX.right) / 2 - row / 2, row)
    spots.domain = { left: start, top: domain.top }
    spots.tool = { left: start + domain.width + gap, top: domain.top }
  }
  return spots
}

/**
 * Phones: the last scene has its own layout (the design team's choice, "option 2"), drawn in screen px
 * on the 169.5-tall picture rather than on the scaled frame: the window and phone at 0.6 of their design
 * size (less on very narrow phones), centred as a group with the window cut by the bottom edge, and the
 * three chips smaller (22 tall, 10px labels; HeroStory.module.css) in Figma's arrangement: "Your domain,
 * your customers" centred above the window, "Live in minutes" low on the left over the phone, "One tool
 * instead of five" on the right over the window.
 */
const PHONE_SHOW = { scale: 0.6, edge: 8, domainTop: 11, liveTop: 132, toolTop: 90 }

/** The phone layout's device scale, x offset of the design frame, and the chips' spots, for a picture `width` wide. */
function phoneShowcase(width: number) {
  const group = PHONE_BOX.left // the phone's left edge … the window's right edge
  const s = Math.min(PHONE_SHOW.scale, (width - 2 * PHONE_SHOW.edge) / (WINDOW_BOX.right - group))
  const x0 = (width - (WINDOW_BOX.right - group) * s) / 2 - group * s
  const chips: Record<ChipId, CSSProperties> = {
    domain: { left: x0 + ((WINDOW_BOX.left + WINDOW_BOX.right) / 2) * s, top: PHONE_SHOW.domainTop, translate: '-50% 0' },
    live: { left: PHONE_SHOW.edge, top: PHONE_SHOW.liveTop },
    tool: { right: PHONE_SHOW.edge, top: PHONE_SHOW.toolTop },
  }
  return { s, x0, chips }
}

/** The part of the 1280 frame inside the picture (design x), less the chips' edge margin. */
function visibleRange(width: number, scale: number): [number, number] {
  const half = width / scale / 2
  const edge = CHIP_EDGE / scale
  return [Math.max(0, 640 - half) + edge, Math.min(1280, 640 + half) - edge]
}

/**
 * The picture's width and the scale of the 1280-wide frame on it: the picture's width, but at least 0.75
 * on tablets (where the frame is wider than the picture and its sides are cut off). Phones show
 * PHONE.view design px across the picture, at most at 0.8, in the phone arrangement.
 */
function useStage() {
  const ref = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState<{ width: number; scale: number; phone: boolean } | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const phone = window.matchMedia('(max-width: 767px)')
    const update = () => {
      const width = el.clientWidth
      if (!width) return
      if (phone.matches) setStage({ width, scale: Math.min(PHONE.maxScale, width / PHONE.view), phone: true })
      else setStage({ width, scale: Math.max(0.75, Math.min(1, width / 1280)), phone: false })
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
  return { ref, stage }
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
  const { ref, stage } = useStage()
  const scale = stage?.scale ?? 1
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

  // Fetch the showcase screenshots (the size the browser will pick) as soon as the story starts, so they
  // are ready when frame 5 arrives 5s later.
  useEffect(() => {
    if (!playing || !stage) return
    for (const shot of Object.values(SHOTS)) {
      const img = new Image()
      img.sizes = shotSizes(shot.width, stage.phone ? phoneShowcase(stage.width).s : stage.scale)
      img.srcset = shot.srcSet
      img.src = shot.src
    }
  }, [playing, stage])

  const f = isStatic ? STILL : frame
  const boxState = f.scene === 'thinking' ? 'thinking' : f.scene === 'live' ? 'live' : 'prompt'
  const showBox = f.scene === 'prompt' || f.scene === 'thinking' || f.scene === 'live'
  const pressingBuild = f.cursor === 'pressBuild'
  const pressingView = f.cursor === 'pressView'
  const phone = stage?.phone ?? false
  const glass = phone ? PHONE.glass : GLASS
  const surface = phone ? PHONE.surface : SURFACE
  const cursor = phone ? PHONE_CURSOR : CURSOR
  const spots = stage && !phone ? chipSpots(...visibleRange(stage.width, stage.scale)) : null
  // Phones: the last scene in its own layer, in screen px (see PHONE_SHOW); elsewhere on the scaled frame.
  const show = stage && phone ? phoneShowcase(stage.width) : null
  const shotScale = show ? show.s : scale

  /* Frame 5: the site on desktop and phone, with the chips around (and above) them. */
  const showcase = (
    <AnimatePresence>
      {f.scene === 'showcase' && (
        <motion.div
          key="window"
          className={styles.window}
          style={
            show
              ? {
                  left: show.x0 + WINDOW_BOX.left * show.s,
                  top: WINDOW_BOX.top * show.s,
                  width: 486 * show.s,
                  height: 300 * show.s,
                  borderRadius: 10 * show.s,
                }
              : undefined
          }
          initial={{ opacity: 0, y: 70, scale: 0.94, filter: 'blur(8px)' }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.55, ease: EASE_OUT, delay: 0.05 },
            transitionEnd: sharpen,
          }}
          exit={sweepOut}
        >
          <img
            src="/assets/v3/hero/story/browser-bar.svg"
            width={485}
            height={16}
            style={show ? { width: 485 * show.s, height: 16 * show.s } : undefined}
            alt=""
          />
          <img
            src={SHOTS.desktop.src}
            srcSet={SHOTS.desktop.srcSet}
            sizes={shotSizes(SHOTS.desktop.width, shotScale)}
            width={SHOTS.desktop.width}
            height={SHOTS.desktop.height}
            style={show ? { width: SHOTS.desktop.width * show.s, height: SHOTS.desktop.height * show.s } : undefined}
            alt=""
          />
        </motion.div>
      )}
      {f.scene === 'showcase' && (
        <motion.img
          key="phone"
          className={styles.phone}
          src={SHOTS.phone.src}
          srcSet={SHOTS.phone.srcSet}
          sizes={shotSizes(SHOTS.phone.width, shotScale)}
          width={SHOTS.phone.width}
          height={SHOTS.phone.height}
          style={
            show
              ? {
                  left: show.x0 + PHONE_BOX.left * show.s,
                  top: PHONE_BOX.top * show.s,
                  width: SHOTS.phone.width * show.s,
                  height: SHOTS.phone.height * show.s,
                }
              : undefined
          }
          alt=""
          initial={{ opacity: 0, x: -80, filter: 'blur(8px)' }}
          animate={{
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.5, ease: EASE_OUT, delay: 0.18 },
            transitionEnd: sharpen,
          }}
          exit={sweepOut}
        />
      )}
      {f.scene === 'showcase' &&
        CHIPS.map((chip, i) => (
          <motion.div
            key={chip.id}
            className={styles.chip}
            style={show ? show.chips[chip.id] : { ...(spots?.[chip.id] ?? { left: chip.left, top: chip.top }), width: chip.width }}
            initial={{ opacity: 0, scale: 0.8, y: 10, filter: 'blur(6px)' }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { type: 'spring', stiffness: 420, damping: 26, delay: chip.delay, filter: { duration: 0.3, delay: chip.delay } },
              transitionEnd: sharpen,
            }}
            exit={sweepOut}
          >
            <span className={styles.chipFloat} style={{ animationDelay: `${-i * 1.15}s` }}>
              <span className={styles.chipIcon}>
                <span className={styles.chipGlyph}>
                  <img
                    src={chip.icon.src}
                    width={chip.icon.width}
                    height={chip.icon.height}
                    style={{ left: chip.icon.left, top: chip.icon.top }}
                    alt=""
                  />
                </span>
              </span>
              <span className={styles.chipText} style={chip.textWidth && !show ? { width: chip.textWidth } : undefined}>
                {chip.label}
              </span>
            </span>
          </motion.div>
        ))}
    </AnimatePresence>
  )

  return (
    <div ref={ref} className={styles.root} data-playing={playing || undefined}>
      <div
        className={styles.stage}
        style={{ '--stage-scale': scale, visibility: stage ? undefined : 'hidden' } as CSSProperties}
        aria-hidden="true"
      >
        {/* Frames 1–4: the frosted box, morphing from prompt to "thinking" to the success card. */}
        <div className={styles.center}>
          <AnimatePresence>
            {showBox && (
              <motion.div
                key="glass"
                className={styles.glass}
                initial={isStatic ? false : { ...glass.prompt, opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                animate={{ ...glass[boxState], opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: sharpen }}
                exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)', transition: { duration: 0.3, ease: EASE_IN } }}
                transition={isStatic ? { duration: 0 } : { ...morph, opacity: { duration: 0.35 }, filter: { duration: 0.35 } }}
              >
                <motion.div
                  className={styles.surface}
                  initial={false}
                  animate={surface[boxState]}
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
                          {/* Phones: the untyped rest keeps its place (unseen), so the two lines don't shift while typing. */}
                          {phone && f.typed < PROMPT.length && <span className={styles.pending}>{PROMPT.slice(f.typed)}</span>}
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

        {!phone && showcase}

        {!isStatic && (
          <motion.div className={styles.cursor} initial={{ x: 1080, y: 420, opacity: 0 }} animate={cursor[f.cursor]}>
            <span className={styles.cursorIcon}>
              <img src="/assets/v3/hero/story/cursor.svg" width={37.7444} height={37.7444} alt="" />
            </span>
          </motion.div>
        )}
      </div>

      {/* Phones: the last scene in its own layer, in screen px, over the shorter picture. */}
      {show && (
        <div className={styles.phoneShow} aria-hidden="true">
          {showcase}
        </div>
      )}
    </div>
  )
}
