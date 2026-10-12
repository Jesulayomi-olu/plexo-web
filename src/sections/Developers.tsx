import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { isPreviewMode, useStaticMotion } from '../lib/motion'
import { CodeReveal } from '../motion/CodeReveal'
import styles from './Developers.module.css'

/**
 * Figma "Developers" (234:1617): 1440×1005 on #fcfcfa.
 * The hidden "Frame 52" pill row and the hidden illustrations/check lists in the rows are omitted.
 */
const rows = [
  // Copy kept exactly as in Figma (234:1671 ends in "ap").
  { title: 'SDK', text: 'A full page and email builder in your React app', className: styles.rowSdk },
  { title: 'Clean export.', text: 'HTML, React, MJML. Ship it as is.', className: styles.rowExport },
  { title: 'Design tokens', text: 'Sync once. On brand forever.', className: styles.rowTokens },
] as const

export default function Developers() {
  const isStatic = useStaticMotion()
  // Preview: the code reveals line by line when the window comes on screen.
  const revealCode = isPreviewMode && !isStatic
  const sdkImage = (
    <img
      src="/assets/dev-sdk.webp"
      width={515}
      height={515}
      alt="Code editor showing app/developer-quickstart.tsx: importing PlexoBuilder and mcpServer, embedding the visual builder canvas and registering MCP tools, with “SDK & MCP Active” and “Vercel Edge Ready” status."
      loading="lazy"
      decoding="async"
    />
  )
  return (
    <section id="developers" data-section="developers" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.header}>
            <Reveal className={styles.pill}>
              <span>For developers</span>
            </Reveal>
            <Reveal delay={0.06} className={styles.intro}>
              <h2 className={`h2 ${styles.heading}`}>
                {/* Figma ends this line with a carriage return that takes up a space when centring (U+00A0 below). */}
                Prompt from your terminal.{' '}
              </h2>
              <p className={`lead ${styles.lead}`}>Or drop the whole builder into your own product.</p>
            </Reveal>
            <Reveal delay={0.12} className={styles.actions}>
              <Button variant="secondary" href="#docs">
                Read the docs
              </Button>
              <a className={styles.link} href="#api-key">
                Get an API key
              </a>
            </Reveal>
          </div>

          <div className={styles.body}>
            <Reveal delay={0.06} className={styles.code}>
              {revealCode ? <CodeReveal>{sdkImage}</CodeReveal> : sdkImage}
            </Reveal>
            <ul className={styles.rows}>
              {rows.map((row, i) => (
                <Reveal as="li" key={row.title} delay={0.12 + i * 0.06} className={`${styles.row} ${row.className}`}>
                  <h3 className={styles.title}>{row.title}</h3>
                  <p className={styles.text}>{row.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
