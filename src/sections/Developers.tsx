import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { DevCodePanel } from './DevCodePanel'
import styles from './Developers.module.css'

/**
 * Figma "Developers" (532:24745): 1440×1148, padding 80, #fcfcfa. Header (pill, heading, lead,
 * "Read the docs" + "Get an API key"), then the 717×515 "SDK quickstart · Dark" panel (built live; its
 * code types itself out) and three feature tiles (415×143, gap 20) framed by lime corner brackets.
 * The hidden "New" tag, sparkle and the hidden contents inside the tiles are omitted.
 */
const features = [
  { title: 'Clean export.', text: 'HTML, React, MJML. Ship it as is.' },
  { title: 'SDK', text: 'A full page and email builder in your React app' },
  { title: 'Design tokens', text: 'Sync once. On brand forever.' },
] as const

export default function Developers() {
  return (
    <section id="developers" data-section="developers" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <Reveal className={styles.pill}>
            <span>For developers</span>
          </Reveal>
          <Reveal delay={0.06} className={styles.intro}>
            <h2 className={`h2 ${styles.heading}`}>
              {/* Figma ends this line with a carriage return that counts as a space when centring. */}
              {'Prompt from your terminal. '}
            </h2>
            <p className={`lead ${styles.lead}`}>
              Bring Plexo&apos;s building capabilities into your workflow or your own product, with tools designed for
              developers.
            </p>
          </Reveal>
          <Reveal delay={0.12} className={styles.actions}>
            <Button variant="secondary" href="#developers">
              Read the docs
            </Button>
            <a className={styles.link} href="#developers">
              Get an API key
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.06} className={styles.code}>
          <DevCodePanel />
        </Reveal>

        <ul className={styles.features}>
          {features.map((f, i) => (
            <Reveal as="li" key={f.title} delay={0.08 + i * 0.06} className={styles.feature}>
              <div className={styles.tile}>
                <h3 className={styles.title}>{f.title}</h3>
                <p className={styles.text}>{f.text}</p>
              </div>
              <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
              <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
