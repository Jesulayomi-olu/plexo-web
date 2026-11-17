import { BlurIn } from '../../components/BlurIn'
import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { DevCodePanel } from '../DevCodePanel'
import { SIGNUP_HREF } from '../navData'
import styles from './DeveloperHero.module.css'

/**
 * For Developers "Hero" (1042:19632): 1440×989, white, padding 80. A centred column: the copy block
 * ("For developers" pill · 8 · the 48px title and the lead (888 box, 16 apart) · 40 · "Start Building"
 * and the underlined "Read the docs", 40 apart; "Read the docs" goes nowhere until there is a docs site),
 * then 80 below it the "SDK quickstart · Dark" code panel
 * (717×515, 1042:20268), the same panel as on the MCP and API page: it types its code out once it is
 * on screen (DevCodePanel).
 */
export default function DeveloperHero() {
  return (
    <section id="top" data-section="developer-hero" className={styles.hero} aria-labelledby="developer-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <BlurIn blur={6} duration={1.1}>
            <p className={styles.tag}>For developers</p>
          </BlurIn>
          <BlurIn as="h1" delay={0.08} blur={14} duration={1.4} className={styles.title}>
            {/* Figma's title ends in a space, which counts when the line is centred (a no-break space keeps it). */}
            <span id="developer-title">{'Prompt from your terminal. '}</span>
          </BlurIn>
          <BlurIn as="p" delay={0.2} blur={8} duration={1.2} className={styles.lead}>
            <span className={styles.line}>Use Plexo&apos;s SDK, API and MCP server to create, customise and publish </span>
            <span className={styles.line}>websites and emails from your own development environment or AI tools.</span>
          </BlurIn>
          <Reveal delay={0.3} className={styles.actions}>
            <Button href={SIGNUP_HREF} variant="secondary">
              Start Building
            </Button>
            {/* No docs site yet: shown as in Figma, but it doesn't lead anywhere for now. */}
            <span className={styles.link}>Read the docs</span>
          </Reveal>
        </div>

        <Reveal delay={0.4} y={24} className={styles.panel}>
          <DevCodePanel />
        </Reveal>
      </div>
    </section>
  )
}
