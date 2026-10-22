'use client'

import { useStaticMotion } from '../lib/motion'
import styles from './FeatureStrip.module.css'

/**
 * Figma "Frame 2147239237" → "Your business" (532:24051): 1440×121, #d5f490. Row "Frame 23" (1280×42 at
 * 80,27, clipped): the label, then the feature list (gap 40), which runs past the right edge.
 * Motion: the list scrolls slowly in a loop (a ticker) and pauses on hover; reduced motion and capture
 * mode show the static Figma row.
 */
// `w`: Figma's hug width (whole pixels), so the row lands exactly where Figma puts it.
const features = [
  { label: 'Website', icon: 'globe-code', w: 88 },
  { label: 'Your Domain', icon: 'globe', w: 116 },
  { label: 'Hosting', icon: 'server', w: 85 },
  { label: 'WordPress import', icon: 'import', w: 154 },
  { label: 'Funnel', icon: 'funnel', w: 77 },
  // In Figma these four rows are top-aligned (text at y 0 instead of 1.5).
  { label: 'Emails', icon: 'mail', w: 76, top: true },
  { label: 'Blog', icon: 'blocks', w: 64, top: true },
  { label: 'Store', icon: 'store', w: 70, top: true },
  { label: 'Export', icon: 'download', w: 77 },
] as const

function FeatureList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className={styles.list} aria-hidden={hidden || undefined}>
      {features.map((f) => (
        <li key={f.label} className={`${styles.item} ${'top' in f ? styles.itemTop : ''}`} style={{ width: f.w }}>
          <span className={styles.iconTile}>
            <img src={`/assets/v2/icons/${f.icon}.svg`} width={14.4} height={14.4} alt="" />
          </span>
          {f.label}
        </li>
      ))}
    </ul>
  )
}

export default function FeatureStrip() {
  const isStatic = useStaticMotion()
  return (
    <section id="features" data-section="features" className={styles.strip} aria-label="Everything your business needs online">
      <div className={styles.row}>
        <p className={styles.label}>{'Everything your Business needs online: '}</p>
        <div className={`${styles.viewport} ${isStatic ? '' : styles.moving}`}>
          <div className={styles.track}>
            <FeatureList />
            {!isStatic && <FeatureList hidden />}
          </div>
        </div>
      </div>
    </section>
  )
}
