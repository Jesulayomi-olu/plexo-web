import type { CSSProperties } from 'react'
import styles from './AiFlowPhone.module.css'

/**
 * The "AI tools → Plexo → live site" diagram on phones (below 768), shared by "Build with AI" (home) and the
 * MCP section (MCP and API page). Figma only draws it sideways at desktop size (1166:15220, 532:24572), so
 * this is the same diagram turned into a vertical flow on a 298.38×192 grid:
 *
 *   [Claude] [ChatGPT] [Cursor]     one row, every pill 28 tall, 8 apart
 *       └────────o────────┘         their connectors drop 28 into the junction under ChatGPT
 *                │
 *             plexo                 the logo at 24 tall, 4 clear of the lines above and below
 *                │
 *                ●                  the output dot, then 9.5 below it (as on desktop) the live site
 *           [Live site]
 *
 * The pills are the desktop labels at 0.7 (Claude, one exported label 42 tall, at 2/3 so it is 28 tall
 * too), built at that size rather than shrunk with a transform, so logos and text stay sharp. Every pill
 * has a fixed width, so the connector ends never depend on font metrics. Lines, dashes, the junction
 * and the dot are the desktop ones at 0.7. Narrow phones (below 375) and wide ones (480 and up) get the
 * whole grid through CSS `zoom`, which renders it at its new size (no bitmap scaling).
 *
 * Motion: the dashes flow toward Plexo and on to the live site, and the output dot pings, while `moving`.
 */
const ASSETS = '/assets/v3/build-with-ai'

/** x of ChatGPT's centre: the junction, the spine, Plexo and the live site line up on it. */
const SPINE = 145.18
const GREY = '#bebeba'
const GREEN = '#74a418'

/* Each run starts at its pill and ends at the junction / Plexo / the dot, so the dashes travel that way. */
const lines = [
  { d: `M45.04 28V56H${SPINE}`, color: GREY }, // Claude (centre 45.04)
  { d: `M249.33 28V56H${SPINE}`, color: GREY }, // Cursor (centre 249.33)
  { d: `M${SPINE} 28V86`, color: GREY }, // ChatGPT, through the junction to Plexo
  { d: `M${SPINE} 118V150`, color: GREEN }, // Plexo to the output dot
] as const

export function AiFlowPhone({ moving }: { moving: boolean }) {
  return (
    <div className={styles.flow}>
      <svg
        className={`${styles.lines} ${moving ? styles.moving : ''}`}
        width={298.38}
        height={192}
        viewBox="0 0 298.38 192"
        aria-hidden="true"
      >
        {lines.map((l) => (
          <path
            key={l.d}
            className={styles.line}
            d={l.d}
            stroke={l.color}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            style={{ '--p': '8px' } as CSSProperties}
          />
        ))}
        {/* "Junction" and "Output dot", at 0.7. */}
        <circle cx={SPINE} cy={56} r={3.3} fill="#ffffff" stroke={GREEN} strokeWidth={1.5} />
        {moving && <circle className={styles.ping} cx={SPINE} cy={150} r={4} fill={GREEN} />}
        <circle cx={SPINE} cy={150} r={4} fill={GREEN} />
      </svg>

      {/* "Label / Claude": the whole label is one SVG (135.12×42), here at 2/3. */}
      <img className={styles.claude} src={`${ASSETS}/label-claude.svg`} width={90.08} height={28} alt="" />

      {/* "Label / ChatGPT" at 0.7: black, padding 7.04 / 13.08, gap 4.03. */}
      <span className={`${styles.pill} ${styles.chatgpt}`}>
        <img src={`${ASSETS}/chatgpt.svg`} width={18.112} height={17.95} alt="" />
        <span>ChatGPT</span>
      </span>

      {/* "Label / Cursor" at 0.7: white, 1px black stroke, padding 7.04 / 13.08, gap 7.04. */}
      <span className={`${styles.pill} ${styles.cursor}`}>
        <img src={`${ASSETS}/cursor-mark.svg`} width={15.887} height={18.112} alt="" />
        <img src={`${ASSETS}/cursor-wordmark.svg`} width={53.041} height={8.935} alt="" />
      </span>

      <img className={styles.logo} src={`${ASSETS}/plexo-logo.svg`} width={92.44} height={24} alt="" />

      {/* "Label / Live site" at 0.7, made 28 tall like the AI pills. */}
      <span className={styles.liveRow}>
        <span className={`${styles.pill} ${styles.live}`}>
          <img src={`${ASSETS}/globe.svg`} width={14.087} height={14.087} alt="" />
          <span>Live site</span>
        </span>
      </span>
    </div>
  )
}
