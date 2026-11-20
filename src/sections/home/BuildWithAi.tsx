'use client'

import { useInView } from 'framer-motion'
import { useLayoutEffect, useMemo, useState, type CSSProperties } from 'react'
import { AiFlowPhone } from '../../components/AiFlowPhone'
import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { useStaticMotion } from '../../lib/motion'
import styles from './BuildWithAi.module.css'

/**
 * Figma "Hero" → "Build with AI. Make it live with Plexo" (Home page V2 1166:15171): 1440×837, #fcfcfa,
 * padding 80/81 (the column starts at x 81). Header "Frame 16" (888×236, centred): the 40px heading, the
 * lead (696 wide) and "Connect your AI" (174×40). Then, 40 below, "Frame 2147239466": the 800×409
 * integration diagram and, 16 to its right, the 464×409 photo panel ("Frame 5") with the 450×321 glass
 * card of four steps in a 2×2 grid (revised November 2026; the steps used to be one column). Hidden in
 * Figma and not rendered: the tabs row "Frame 42", the "New" badge, the dot pattern, the "Frame 12" /
 * "Frame 5" overlays, the panel's off-canvas "Start free" and the diagram's prompt cards (their text is
 * transparent).
 *
 * Motion: the dashes flow along the connectors toward Plexo and on to the live site, and the output dot
 * sends out a soft ping, as in the MCP section; both pause off screen. The steps fade up in turn.
 * Reduced motion / capture mode: static.
 *
 * Layout: ≥1200 the 1280×409 row is the Figma composition, scaled down uniformly below 1440. 768–1199:
 * the diagram (scaled to fit) and the panel stack. Phones: the diagram as a vertical flow (AiFlowPhone,
 * shared with the MCP section), then the panel, its steps in one column below 480.
 */
const DIAGRAM_LABEL = 'Diagram: Claude, ChatGPT and Cursor connect to Plexo, which publishes your live site.'

const ROW_WIDTH = 1280 // 800 + 16 + 464
const DIAGRAM_WIDTH = 800

/*
 * "Connectors" (977.46×546.23 at 0,0): centrelines, dash lengths and colours from the Figma export.
 * Figma doesn't carry the dash pattern unbroken round the corners, so each straight run is its own path,
 * and `offset` (fitted to Figma's render) puts its dashes where Figma draws them. The dashes travel one
 * period (dash + gap) along each run toward Plexo / the live site, forever.
 */
const GREY = '#bebeba'
const lines = [
  { d: 'M178 37H389', dash: 5.75, offset: 1.5, width: 2.15617, color: GREY }, // Line / Claude
  { d: 'M389 37V281', dash: 5.75, offset: 2.5, width: 2.15617, color: GREY },
  { d: 'M177 358H388', dash: 5.76, offset: 1.75, width: 2.15844, color: GREY }, // Line / Cursor
  { d: 'M388 358V281', dash: 5.76, offset: 4.25, width: 2.15844, color: GREY },
  { d: 'M314 202H437.62', dash: 5.75, offset: 4.5, width: 2.15617, color: GREY }, // Line / ChatGPT
  { d: 'M536 202H608', dash: 5.75, offset: 2, width: 2.15617, color: '#74a418' }, // Line / Output
] as const

function Connectors({ moving }: { moving: boolean }) {
  return (
    <svg
      className={`${styles.connectors} ${moving ? styles.moving : ''}`}
      width={977.463}
      height={546.229}
      viewBox="0 0 977.463 546.229"
      aria-hidden="true"
    >
      {lines.map((l) => (
        <path
          key={l.d}
          className={styles.line}
          d={l.d}
          stroke={l.color}
          strokeWidth={l.width}
          strokeDasharray={`${l.dash} ${l.dash}`}
          strokeDashoffset={l.offset}
          style={{ '--o': `${l.offset}px`, '--p': `${l.dash * 2}px` } as CSSProperties}
        />
      ))}
      {/* "Junction": 11.5 circle, white, 2.16 #74a418 stroke. */}
      <circle cx={391.109} cy={200.605} r={4.6717} fill="#ffffff" stroke="#74a418" strokeWidth={2.15617} />
      {/* "Frame 2147239525": the output line's "Output dot" and its ping. */}
      {moving && <circle className={styles.ping} cx={606.75} cy={201.75} r={5.74978} fill="#74a418" />}
      <circle cx={606.75} cy={201.75} r={5.74978} fill="#74a418" />
    </svg>
  )
}

/* "Label / ChatGPT": black pill, 40 tall, padding 8.6 18.7 8.6 10.1, gap 5.75. */
function ChatGptLabel({ className }: { className?: string }) {
  return (
    <span className={`${styles.pill} ${styles.chatgpt} ${className ?? ''}`}>
      <img src="/assets/v3/build-with-ai/chatgpt.svg" width={25.874} height={25.6431} alt="" />
      <span>ChatGPT</span>
    </span>
  )
}

/* "Label / Cursor": white pill, 1.44 black stroke, padding 8.6 18.7 8.6 10.1, gap 10.1. */
function CursorLabel({ className }: { className?: string }) {
  return (
    <span className={`${styles.pill} ${styles.cursor} ${className ?? ''}`}>
      <img src="/assets/v3/build-with-ai/cursor-mark.svg" width={22.696} height={25.874} alt="" />
      <img src="/assets/v3/build-with-ai/cursor-wordmark.svg" width={75.7722} height={12.7645} alt="" />
    </span>
  )
}

/* "Label / Live site": #1d3509 pill, padding 8.6/17.2, gap 8.6, 20px globe. */
function LiveLabel({ className }: { className?: string }) {
  return (
    <span className={`${styles.pill} ${styles.live} ${className ?? ''}`}>
      <img src="/assets/v3/build-with-ai/globe.svg" width={20.1242} height={20.1242} alt="" />
      <span>Live site</span>
    </span>
  )
}

/* "Label / Claude": the whole label is one SVG (white pill, #d97757 stroke, logo and wordmark). */
function ClaudeLabel({ className }: { className?: string }) {
  return (
    <img
      className={className}
      src="/assets/v3/build-with-ai/label-claude.svg"
      width={135.12}
      height={42}
      alt=""
    />
  )
}

/** "Integration · Ask Claude, Plexo ships": 800×409, #e8e8e4, r16, clipped. */
function Diagram({ moving }: { moving: boolean }) {
  return (
    <div className={styles.integration}>
      <Connectors moving={moving} />
      {/* "Frame" (the Plexo logo) at (438, 189) inside "Connectors". */}
      <img className={styles.logo} src="/assets/v3/build-with-ai/plexo-logo.svg" width={101.747} height={26.4157} alt="" />
      <ClaudeLabel className={styles.claudeAt} />
      <ChatGptLabel className={styles.chatgptAt} />
      <CursorLabel className={styles.cursorAt} />
      <LiveLabel className={styles.liveAt} />
    </div>
  )
}

const ASSETS = '/assets/v3/build-with-ai'

/*
 * Step icons (the revised cards, 1193:91xx). The "SOL avatar" rounds are 16px; ChatGPT's SVG runs ~1px
 * past its round on every side, as Figma's image does.
 */

/* "Frame 2147239527": ChatGPT (16.34) and Claude (16) overlapping (−10.8), on #e8e8e4, padding 2.4, r4. */
function AiPair() {
  return (
    <span className={styles.pair}>
      <span className={styles.pairChatgpt}>
        <img src={`${ASSETS}/steps-chatgpt.svg`} width={18.3404} height={18.3404} alt="" />
      </span>
      <img src={`${ASSETS}/steps-claude.svg`} width={16} height={16} alt="" />
    </span>
  )
}

/* "Frame 2147239528": ChatGPT and Claude 9.4 apart, a link, then the Plexo mark; gap 4, padding 2.4/2. */
function ConnectRow() {
  return (
    <span className={styles.connect}>
      <span className={styles.connectPair}>
        <img className={styles.connectChatgpt} src={`${ASSETS}/steps-chatgpt-small.svg`} width={18.1702} height={18.1702} alt="" />
        <img className={styles.connectClaude} src={`${ASSETS}/steps-claude.svg`} width={16} height={16} alt="" />
      </span>
      <img src={`${ASSETS}/steps-link.svg`} width={12} height={12} alt="" />
      <img src={`${ASSETS}/steps-plexo-mark.svg`} width={15.1071} height={16} alt="" />
    </span>
  )
}

/** "Glass / You type": four white cards, each an icon row over the text. */
const steps = [
  // Full stop added (Figma leaves it off).
  { icon: <AiPair />, text: 'Describe what you want to build in your AI agent.' },
  { icon: <ConnectRow />, text: 'Link your AI tool to Plexo using MCP or the SDK.' },
  {
    // "Frame 2147239526": #1d3509, padding 2.036, r12.214, a white 17.07 globe (21.14 square). Full stop added.
    icon: (
      <span className={styles.globeBadge}>
        <img src={`${ASSETS}/steps-globe.svg`} width={17.0688} height={17.0688} alt="" />
      </span>
    ),
    text: 'Ask your AI to create directly in Plexo, publish it online.',
  },
  {
    // "Success icon": 21.14 #b8f34a round, 10.57 check.
    icon: (
      <span className={styles.success}>
        <img src={`${ASSETS}/steps-check.svg`} width={10.57} height={10.57} alt="" />
      </span>
    ),
    text: 'Your site is live on a Plexo domain. Add your custom domain and update as you grow.',
  },
]

function StepsPanel() {
  return (
    <div className={styles.panel}>
      {/* "bg 1": the photo, blurred (baked into a 2× export clipped to the panel). */}
      <img className={styles.photo} src={`${ASSETS}/steps-photo.webp`} width={464} height={409} alt="" />
      <div className={styles.glass}>
        <ol className={styles.steps} aria-label="How it works">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.text} className={styles.step} delay={0.1 + i * 0.08} y={8}>
              <span className={styles.stepIcon} aria-hidden="true">
                {step.icon}
              </span>
              <span className={styles.stepText}>{step.text}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  )
}

/** A callback ref that also exposes `.current`, so it can be passed to hooks that expect a ref object. */
type NodeRef<T> = ((node: T | null) => void) & { current: T | null }

/**
 * Width of the content column, for the uniform scale of the fixed compositions. The ref follows its
 * element: Reveal swaps the measured node after hydration in capture mode and for reduced motion (a
 * plain element instead of a motion one), and the detached node must not leave the scale at 1 (as
 * useFitScale does).
 */
function useColumnWidth<T extends HTMLElement>() {
  const [el, setEl] = useState<T | null>(null)
  const [width, setWidth] = useState(0)
  const ref = useMemo(() => {
    const fn = ((node: T | null) => {
      fn.current = node
      setEl(node)
    }) as NodeRef<T>
    fn.current = null
    return fn
  }, [])
  useLayoutEffect(() => {
    if (!el) return
    const update = () => {
      // Detached or hidden: keep the last width until it has one again.
      if (el.clientWidth) setWidth(el.clientWidth)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [el])
  return { ref, width }
}

export default function BuildWithAi() {
  const isStatic = useStaticMotion()
  const { ref: stageRef, width } = useColumnWidth<HTMLDivElement>()
  const onScreen = useInView(stageRef)
  const moving = !isStatic && onScreen
  const scale = {
    '--s': width ? Math.min(1, width / ROW_WIDTH) : 1,
    '--d': width ? Math.min(1, width / DIAGRAM_WIDTH) : 1,
  } as CSSProperties

  return (
    <section id="build-with-ai" data-section="build-with-ai" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <Reveal className={styles.intro}>
            <h2 className={styles.heading}>{'Build with AI. \nMake it live with Plexo'}</h2>
            <p className={styles.lead}>
              Plexo hosts and publishes the websites you build with ChatGPT, Claude and other AI agents. Keep
              creating with the tools you already use, while Plexo gives your work a home on the web.
            </p>
          </Reveal>
          <Reveal delay={0.12} className={styles.cta}>
            <Button variant="primary" href="/features/mcp" className={styles.button}>
              Connect your AI
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div ref={stageRef} className={styles.stage} style={scale}>
            <div className={styles.row}>
              <div className={styles.diagramFit} role="img" aria-label={DIAGRAM_LABEL}>
                <Diagram moving={moving} />
              </div>
              <div className={styles.mobileCard} role="img" aria-label={DIAGRAM_LABEL}>
                <AiFlowPhone moving={moving} />
              </div>
              <StepsPanel />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
