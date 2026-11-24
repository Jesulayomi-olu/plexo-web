import type { ReactNode } from 'react'
import { BlurIn } from '../components/BlurIn'
import styles from './PageHero.module.css'

type PageHeroProps = {
  /** `data-section` name. */
  section: string
  title: string
  lead: ReactNode
  /** Shorter panel, sized to its text (the legal pages); the default is the Get in touch hero's 398. */
  compact?: boolean
}

/**
 * The dark "Pricing Hero" panel under the nav (Get in touch 1349:8585, as the Resources hero): r40 top
 * corners, #1d3509 with the fine line pattern under a 20% black wash, the heading (600 40/46, white) and
 * a 592-wide line (16/24, #fcfcfa), centred.
 */
export default function PageHero({ section, title, lead, compact = false }: PageHeroProps) {
  const titleId = `${section}-title`
  return (
    <section id="top" data-section={section} className={styles.section} aria-labelledby={titleId}>
      <div className={`${styles.panel} ${compact ? styles.compact : ''}`}>
        <div className={styles.copy}>
          <BlurIn as="h1" blur={14} duration={1.4} className={styles.title}>
            <span id={titleId}>{title}</span>
          </BlurIn>
          <BlurIn as="p" delay={0.15} blur={8} duration={1.2} className={styles.lead}>
            {lead}
          </BlurIn>
        </div>
      </div>
    </section>
  )
}
