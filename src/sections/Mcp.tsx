'use client'

import { useInView } from 'framer-motion'
import { useRef, type CSSProperties } from 'react'
import { AiFlowPhone } from '../components/AiFlowPhone'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { useStaticMotion } from '../lib/motion'
import { useFitScale } from '../lib/useFitScale'
import claudeLabel from '../assets/v2/mcp-claude.svg'
import chatgptLabel from '../assets/v2/mcp-chatgpt.svg'
import cursorLabel from '../assets/v2/mcp-cursor.svg'
import liveLabel from '../assets/v2/mcp-livesite.svg'
import dots from '../assets/v2/mcp-dots.svg'
import styles from './Mcp.module.css'

/**
 * Figma "Mcp" (532:24572): 1440×1035, padding 80, #fcfcfa. Header (pill, heading, lead, "Connect
 * your AI"), then the 1280×508 diagram "Frame 28": Claude, ChatGPT and Cursor connect through a
 * junction into Plexo, which feeds the live site. The (invisible) prompt cards and the hidden chat
 * bubble are not rendered.
 *
 * Motion: the dashes flow along the connectors toward Plexo and on to the live site, and the
 * output dot sends out a soft ping; both pause off screen. Reduced motion / capture mode: static.
 */
const LABEL = 'Diagram: Claude, ChatGPT and Cursor connect to Plexo, which publishes your live site.'

/*
 * Connector centrelines in "Integration" coordinates (1184.1×661.7), from the Figma export. Figma
 * stretches each line's 8/8-ish dashes to fit, starting and ending on half a dash: `dash` is the
 * fitted length, `offset` puts the path start halfway through one.
 */
const lines = [
  { d: 'M215.157 80.8634H471.156V340.771', dash: 7.111, color: '#bebeba' },
  { d: 'M215.097 474.213H470.211V341.153', dash: 7.087, color: '#bebeba' },
  { d: 'M216.597 273.513H624.78', dash: 7.037, color: '#bebeba' },
  { d: 'M757.34 273.123H1027.46', dash: 7.109, color: '#74a418' },
] as const

function Connectors({ moving }: { moving: boolean }) {
  return (
    <svg className={`${styles.connectors} ${moving ? styles.moving : ''}`} viewBox="0 0 1184.1 661.7" aria-hidden="true">
      {lines.map((l) => (
        <path
          key={l.d}
          className={styles.line}
          d={l.d}
          stroke={l.color}
          strokeWidth={2.61316}
          strokeDasharray={`${l.dash} ${l.dash}`}
          strokeDashoffset={l.dash / 2}
          style={{ '--o': `${l.dash / 2}px`, '--p': `${l.dash * 2}px` } as CSSProperties}
        />
      ))}
      {/* "Junction": 13.93 circle, white, 2.61 #74a418 inside stroke. */}
      <circle cx={470.369} cy={273.422} r={5.662} fill="#ffffff" stroke="#74a418" strokeWidth={2.61316} />
      {/* "Output dot" and its ping. */}
      {moving && <circle className={styles.ping} cx={1020.42} cy={274.088} r={6.96842} fill="#74a418" />}
      <circle cx={1020.42} cy={274.088} r={6.96842} fill="#74a418" />
    </svg>
  )
}

/**
 * Desktop / tablet: the Figma composition at 1280×508, scaled to fit below 1440. The MCP and API page's
 * frame (668:28669) hides the dot pattern, so only the home variant draws it.
 */
function DesktopDiagram({ moving, grid }: { moving: boolean; grid: boolean }) {
  return (
    <div className={styles.frame}>
      <div className={styles.integration}>
        {grid && <img className={styles.dots} src={dots.src} width={1280} height={711} alt="" />}
        <Connectors moving={moving} />
        <img className={styles.logo} src="/assets/v2/icons/logo-dark.svg" width={124} height={32} alt="" />
        <img className={styles.claude} src={claudeLabel.src} width={164} height={56} alt="" />
        <img className={styles.chatgpt} src={chatgptLabel.src} width={165} height={52} alt="" />
        <img className={styles.cursor} src={cursorLabel.src} width={170} height={56} alt="" />
        <img className={styles.live} src={liveLabel.src} width={159} height={46} alt="" />
      </div>
    </div>
  )
}

/*
 * Phones: the vertical flow shared with Build with AI (AiFlowPhone): the three AI pills in a row, all 28
 * tall and evenly spaced, their connectors meeting under ChatGPT, then Plexo and the live site. Same
 * flowing dashes and ping as desktop. (The desktop labels above are single SVGs of different heights,
 * 52 to 56, which didn't scale to one size cleanly.)
 */
function MobileDiagram({ moving }: { moving: boolean }) {
  return (
    <div className={styles.mobileWrap}>
      <AiFlowPhone moving={moving} />
    </div>
  )
}

/**
 * The MCP and API page (668:28635, 1440×975) uses the same section with a one-line 40px heading
 * ("Ask Claude. Plexo ships.") and a two-line lead (Figma's own break, 568 box), so its header is 227
 * tall; its diagram has no dot pattern.
 */
const copy = {
  home: {
    title: 'Plexo now works in Claude, chatgpt\n and Cursor',
    lead: ' Already living in Claude, ChatGPT or Cursor?\n Build your site from there',
  },
  page: {
    // Figma ends the heading and the lead's first line with a space, which counts when centring.
    title: 'Ask Claude. Plexo ships.\u00a0',
    lead: 'Bring your AI coding tools and Plexo together. Create, edit and publish \nyour projects without leaving the workflow you already use.',
  },
}

export default function Mcp({ variant = 'home' }: { variant?: 'home' | 'page' }) {
  const isStatic = useStaticMotion()
  const { ref: fitRef, scale, fitted } = useFitScale<HTMLDivElement>(1280, 768)
  const flowRef = useRef<HTMLDivElement>(null)
  const onScreen = useInView(flowRef)
  const moving = !isStatic && onScreen

  return (
    <section id="mcp" data-section="mcp" className={`${styles.section} ${variant === 'page' ? styles.page : ''}`}>
      <div className="container">
        <div className={styles.header}>
          <Reveal className={styles.pill}>
            <span>Plexo Mcp</span>
          </Reveal>
          <Reveal delay={0.06} className={styles.intro}>
            <h2 className={`h2 ${styles.heading}`}>{copy[variant].title}</h2>
            <p className={`lead ${styles.lead}`}>{copy[variant].lead}</p>
          </Reveal>
          <Reveal delay={0.12} className={styles.cta}>
            <Button variant="primary" href="#mcp">
              Connect your AI
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div ref={flowRef} role="img" aria-label={LABEL}>
            <div
              ref={fitRef}
              className={styles.fit}
              style={{ '--s': scale, display: fitted ? undefined : 'none' } as CSSProperties}
            >
              <div className={styles.scale}>
                <DesktopDiagram moving={moving && fitted} grid={variant === 'home'} />
              </div>
            </div>
            {!fitted && <MobileDiagram moving={moving} />}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
