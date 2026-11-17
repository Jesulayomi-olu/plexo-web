'use client'

import { Reveal } from '../../components/Reveal'
import styles from './SolFeatures.module.css'

/**
 * Build with Sol "More Than a Template Filler" (575:15582): white, padding 80 (+80 inside), heading
 * (48 bold) · 64 · a 2×2 grid (gap 40) of 430×143 cards: #f4f5f0, r4, padding 38/16, title (700 24/30)
 * · 16 · line (400 14/21), with 20px #74a418 corner marks (2px) at the four corners.
 * The last two lines break where Figma breaks them ("\n"), and their second lines start with a space.
 */
const features = [
  { title: 'Copy that sells', body: "Get tailored content that speaks to your audience and what you're offering." },
  { title: 'Remembers your brand', body: "Keep your brand's colours, tone and visual direction consistent." },
  { title: 'You stay in control', body: 'Refine what Sol creates. Change the details, structure\n and content whenever you want.' },
  { title: 'Design tokens', body: 'Make global design changes without having to update\n every element individually.' },
]

export default function SolFeatures() {
  return (
    <section id="features" data-section="sol-features" className={styles.section} aria-labelledby="sol-features-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.head}>
          {/* Figma's heading ends with a space, but its 888 box draws the line centred without it. */}
          <h2 id="sol-features-title" className={`h2 ${styles.title}`}>
            More Than a Template Filler
          </h2>
        </Reveal>
        <ul className={styles.grid}>
          {features.map((feature, i) => (
            <Reveal key={feature.title} as="li" delay={0.06 * i} className={styles.card}>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardBody}>{feature.body}</p>
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
