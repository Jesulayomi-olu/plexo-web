import { Reveal } from '../../components/Reveal'
import styles from './DeveloperTools.module.css'

/**
 * For Developers "Made for you" (1042:20456): white, padding 100/0, gap 40. The heading block (630
 * wide, gap 24: "Bring Plexo into your workflow" and a 408-wide lead), then an 840-wide 2×2 grid (gap
 * 40) of tool cards: #e8e8e4, square corners, padding 24/24/32, the 20px #365811 name · 12 · the
 * 16/24 description (331 wide). Each row of cards shares the taller card's height (168).
 */
const TOOLS = [
  {
    name: 'SDK',
    body: "Use Plexo's SDK to integrate website and email creation into your applications and workflows.",
  },
  {
    name: 'API & Webhooks',
    body: 'Connect Plexo to your existing tools and services, and build custom integrations.',
  },
  {
    name: 'MCP Server',
    body: 'Connect AI coding tools like Claude and Cursor to Plexo to create, edit and publish projects.',
  },
  {
    name: 'Code Export',
    body: 'Export clean HTML and React code when you want to continue development or host elsewhere.',
  },
] as const

export default function DeveloperTools() {
  return (
    <section id="workflow" data-section="workflow" className={styles.section} aria-labelledby="workflow-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.head}>
          <h2 id="workflow-title" className={styles.title}>
            Bring Plexo into your workflow
          </h2>
          <p className={styles.lead}>Connect your tools, automate your workflow and build with the flexibility you need.</p>
        </Reveal>
        <ul className={styles.grid}>
          {TOOLS.map((tool, i) => (
            <Reveal as="li" key={tool.name} delay={0.06 * i} className={styles.card}>
              <h3 className={styles.name}>{tool.name}</h3>
              <p className={styles.body}>{tool.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
