'use client'

import { useInView } from 'framer-motion'
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { useStaticMotion } from '../../lib/motion'
import styles from './BuildWithAi.module.css'

/**
 * Figma "Hero" → "Build with AI. Make it live with Plexo" (Home page V2 1166:15171): 1440×837, #fcfcfa,
 * padding 80/81 (the column starts at x 81). Header "Frame 16" (888×236, centred): the 40px heading, the
 * lead (696 wide) and "Connect your AI" (174×40). Then, 40 below, "Frame 2147239466": the 800×409
 * integration diagram and, 16 to its right, the 464×409 photo panel with the glass card of four steps.
 * Hidden in Figma and not rendered: the tabs row "Frame 42", the "New" badge, the dot pattern, the
 * "Frame 12" / "Frame 5" overlays, the panel's off-canvas "Start free" and the diagram's prompt cards
 * (their text is transparent).
 *
 * Motion: the dashes flow along the connectors toward Plexo and on to the live site, and the output dot
 * sends out a soft ping, as in the MCP section; both pause off screen. The steps fade up in turn.
 * Reduced motion / capture mode: static.
 *
 * Layout: ≥1200 the 1280×409 row is the Figma composition, scaled down uniformly below 1440. 768–1199:
 * the diagram (scaled to fit) and the panel stack. Phones: a vertical version of the diagram, then the
 * panel.
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

/*
 * Phones: a vertical flow on a 320×218 grid (as the MCP section's phone diagram). The three AI labels sit
 * in a row at 28px tall, 10 apart; their connectors drop into a junction under ChatGPT, the spine runs
 * into Plexo and on to the live site. Same parts, colours and flowing dashes as desktop.
 */
const SPINE = 156.01 // x of the ChatGPT label's centre, the junction, Plexo and the live site
const mobileLines = [
  { d: `M53.54 28V62H${SPINE}`, color: '#bebeba' },
  { d: `M262.44 28V62H${SPINE}`, color: '#bebeba' },
  { d: `M${SPINE} 28V104`, color: '#bebeba' },
  { d: `M${SPINE} 140V190`, color: '#74a418' },
]

function MobileDiagram({ moving }: { moving: boolean }) {
  return (
    <div className={styles.mobileWrap}>
      <div className={styles.mobile}>
        <svg className={`${styles.mLines} ${moving ? styles.moving : ''}`} viewBox="0 0 320 218" aria-hidden="true">
          {mobileLines.map((l) => (
            <path
              key={l.d}
              className={styles.line}
              d={l.d}
              stroke={l.color}
              strokeWidth={1.8}
              strokeDasharray="5 5"
              style={{ '--p': '10px' } as CSSProperties}
            />
          ))}
          <circle cx={SPINE} cy={62} r={4} fill="#ffffff" stroke="#74a418" strokeWidth={1.8} />
          {moving && <circle className={styles.ping} cx={SPINE} cy={190} r={4.5} fill="#74a418" />}
          <circle cx={SPINE} cy={190} r={4.5} fill="#74a418" />
        </svg>
        <span className={`${styles.mLabel} ${styles.mClaude}`}>
          <ClaudeLabel />
        </span>
        <span className={`${styles.mLabel} ${styles.mChatgpt}`}>
          <ChatGptLabel />
        </span>
        <span className={`${styles.mLabel} ${styles.mCursor}`}>
          <CursorLabel />
        </span>
        <img className={styles.mLogo} src="/assets/v3/build-with-ai/plexo-logo.svg" width={101.747} height={26.4157} alt="" />
        <span className={`${styles.mLabel} ${styles.mLive}`}>
          <LiveLabel />
        </span>
      </div>
    </div>
  )
}

const ASSETS = '/assets/v3/build-with-ai'

/* "SOL avatar": 19.2px rounds; ChatGPT's image is drawn 6.25% larger on every side (21.6). */
function Avatar({ name }: { name: 'chatgpt' | 'claude' | 'cursor' }) {
  const size = name === 'chatgpt' ? 21.6 : 19.2
  return (
    <span className={`${styles.avatar} ${name === 'chatgpt' ? styles.avatarOut : ''}`}>
      <img src={`${ASSETS}/avatar-${name}.svg`} width={size} height={size} alt="" />
    </span>
  )
}

/* "Frame 2147239527": the three AI tools overlapping (−10.8 each), on #e8e8e4, padding 2.4, r4. */
function AiStack() {
  return (
    <span className={styles.stack}>
      <Avatar name="chatgpt" />
      <Avatar name="claude" />
      <Avatar name="cursor" />
    </span>
  )
}

/* "Frame 2147239528": the AI tools 8.4 apart, a link, then the Plexo mark; gap 4, padding 2.4/2. */
function ConnectRow() {
  return (
    <span className={styles.connect}>
      <span className={styles.connectStack}>
        <Avatar name="chatgpt" />
        <Avatar name="claude" />
        <Avatar name="cursor" />
      </span>
      <span className={styles.link}>
        <img src={`${ASSETS}/link.svg`} width={10.5} height={5.5} alt="" />
      </span>
      <img src={`${ASSETS}/plexo-mark.svg`} width={16.995} height={18} alt="" />
    </span>
  )
}

/** "Glass / You type": four white cards, each an icon row over one line of text. */
const steps = [
  { icon: <AiStack />, text: 'Describe what you want to build in your AI agent', oneLine: true },
  { icon: <ConnectRow />, text: 'Link your AI tool to Plexo using MCP or the SDK.' },
  {
    // "Frame 2147239526": #1d3509, padding 2.4, r14.4, a white 20px globe.
    icon: (
      <span className={styles.globeBadge}>
        <img src={`${ASSETS}/globe-white.svg`} width={20.1242} height={20.1242} alt="" />
      </span>
    ),
    text: 'Ask your AI to create directly in Plexo, publish it online',
  },
  {
    // "Success icon": 24px #b8f34a round, 12px check.
    icon: (
      <span className={styles.success}>
        <img src={`${ASSETS}/check.svg`} width={12} height={12} alt="" />
      </span>
    ),
    text: 'Your website is live on a Plexo domain, with the option to connect your own domain and manage & update it as your business grows.',
  },
]

function StepsPanel() {
  return (
    <div className={styles.panel}>
      {/* "bg 1": the photo, blurred (baked into a 2× export clipped to the panel). */}
      <img className={styles.photo} src={`${ASSETS}/steps-photo.webp`} width={464} height={409} alt="" />
      <ol className={styles.glass} aria-label="How it works">
        {steps.map((step, i) => (
          <Reveal as="li" key={step.text} className={styles.step} delay={0.1 + i * 0.08} y={8}>
            <span className={styles.stepIcon} aria-hidden="true">
              {step.icon}
            </span>
            <span className={`${styles.stepText} ${step.oneLine ? styles.oneLine : ''}`}>{step.text}</span>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

/** Width of the content column, for the uniform scale of the fixed compositions. */
function useColumnWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
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
                <MobileDiagram moving={moving} />
              </div>
              <StepsPanel />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
