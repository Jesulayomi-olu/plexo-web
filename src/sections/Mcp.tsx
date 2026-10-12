import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { isPreviewMode } from '../lib/motion'
import { McpFlow } from '../motion/McpFlow'
import styles from './Mcp.module.css'

/**
 * Figma "Mcp" (234:1228): 1440×1051 on #fcfcfa.
 * The "Chat bubble" (234:1249) sits outside its clipped frame and is not rendered; the hidden
 * illustrations and check lists inside the cards are omitted.
 */
const cards = [
  { title: 'No new tab.', text: 'Build, edit and publish from your chat' },
  { title: 'Works with your AI', text: 'Claude, ChatGPT, Cursor and more' },
  // Figma keeps a leading space in this description (234:1389).
  { title: 'You stay in charge', text: ' Every change shows up on your canvas.' },
] as const

export default function Mcp() {
  return (
    <section id="mcp" data-section="mcp" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.header}>
            <Reveal className={styles.pill}>
              <span>Plexo Mcp</span>
            </Reveal>
            <Reveal delay={0.06} className={styles.intro}>
              <h2 className={`h2 ${styles.heading}`}>Ask Claude. Plexo ships.</h2>
              <p className={`lead ${styles.lead}`}>
                {' Already living in Claude, ChatGPT or Cursor?\n Build your site from there'}
              </p>
            </Reveal>
            <Reveal delay={0.12} className={styles.cta}>
              <Button variant="primary" href="#mcp-connect">
                Connect your AI
              </Button>
            </Reveal>
          </div>

          <div className={styles.body}>
            <Reveal delay={0.06} className={styles.diagram}>
              {isPreviewMode ? (
                <div className={styles.flow} role="img" aria-label="Diagram: prompts from Claude, ChatGPT and Cursor flow into Plexo, which publishes a live site at glowbyamy.com.">
                  <McpFlow />
                </div>
              ) : (
                <img
                  src="/assets/mcp-diagram.webp"
                  width={606.5}
                  height={339}
                  alt="Diagram: prompts from Claude, ChatGPT and Cursor flow into Plexo, which publishes a live site at glowbyamy.com."
                  loading="lazy"
                  decoding="async"
                />
              )}
            </Reveal>
            <ul className={styles.cards}>
              {cards.map((card, i) => (
                <Reveal as="li" key={card.title} delay={0.12 + i * 0.06} className={styles.card}>
                  <h3 className={styles.title}>{card.title}</h3>
                  <p className={styles.text}>{card.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
