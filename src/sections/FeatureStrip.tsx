import { useStaticMotion } from '../lib/motion'
import styles from './FeatureStrip.module.css'

/**
 * Figma "Frame 2147239237" → "Your business" (532:24051): 1440×121, #d5f490. Row "Frame 23" (1280×42 at
 * 80,27, clipped): the label, then the feature list (gap 40), which runs past the right edge.
 * Motion: the list scrolls slowly in a loop (a ticker) and pauses on hover; reduced motion and capture
 * mode show the static Figma row.
 */
const features = [
  { label: 'Website', icon: 'globe-code' },
  { label: 'Your Domain', icon: 'globe' },
  { label: 'Hosting', icon: 'server' },
  { label: 'WordPress import', icon: 'import' },
  { label: 'Funnel', icon: 'funnel' },
  // In Figma these four rows are top-aligned (text at y 0 instead of 1.5).
  { label: 'Emails', icon: 'mail', top: true },
  { label: 'Blog', icon: 'blocks', top: true },
  { label: 'Store', icon: 'store', top: true },
  { label: 'Export', icon: 'download' },
] as const

function FeatureList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className={styles.list} aria-hidden={hidden || undefined}>
      {features.map((f) => (
        <li key={f.label} className={`${styles.item} ${'top' in f ? styles.itemTop : ''}`}>
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
