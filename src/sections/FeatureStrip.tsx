'use client'

import { useStaticMotion } from '../lib/motion'
import styles from './FeatureStrip.module.css'

/**
 * Figma "Frame 2147239237" → "Your business" (532:24051): 1440×121, #d5f490. Row "Frame 23" (1280×42 at
 * 80,27, clipped): the label, then the feature list (gap 40), which runs past the right edge.
 * Motion: the list scrolls slowly in a loop (a ticker) and pauses on hover; reduced motion and capture
 * mode show the static Figma row.
 */
// `w`: Figma's hug width (whole pixels), so the row lands exactly where Figma puts it. `top`: in Figma
// these rows are top-aligned (text at y 0 instead of 1.5).
type Feature = { label: string; icon: string; w: number; top?: boolean }

const homeFeatures: Feature[] = [
  { label: 'Website', icon: '/assets/v2/icons/globe-code.svg', w: 88 },
  { label: 'Your Domain', icon: '/assets/v2/icons/globe.svg', w: 116 },
  { label: 'Hosting', icon: '/assets/v2/icons/server.svg', w: 85 },
  { label: 'WordPress import', icon: '/assets/v2/icons/import.svg', w: 154 },
  { label: 'Funnel', icon: '/assets/v2/icons/funnel.svg', w: 77 },
  { label: 'Emails', icon: '/assets/v2/icons/mail.svg', w: 76, top: true },
  { label: 'Blog', icon: '/assets/v2/icons/blocks.svg', w: 64, top: true },
  { label: 'Store', icon: '/assets/v2/icons/store.svg', w: 70, top: true },
  { label: 'Export', icon: '/assets/v2/icons/download.svg', w: 77 },
]

/** MCP and API (669:28982 → 938:6560): what an AI can do through Plexo. */
const mcpFeatures: Feature[] = [
  { label: 'Create pages', icon: '/assets/features/mcp/create-page.svg', w: 123 },
  { label: 'Edit content', icon: '/assets/features/mcp/edit-content.svg', w: 115 },
  { label: 'Publish', icon: '/assets/features/mcp/publish.svg', w: 81 },
  { label: 'Design emails', icon: '/assets/features/mcp/design-emails.svg', w: 125 },
  { label: 'Add products', icon: '/assets/features/mcp/add-products.svg', w: 125 },
  { label: 'Read analytics', icon: '/assets/features/mcp/analytics.svg', w: 129, top: true },
]

const variants = {
  home: { label: 'Everything your Business needs online: ', features: homeFeatures },
  mcp: { label: 'What your AI can do: ', features: mcpFeatures },
}

function FeatureList({ features, hidden = false }: { features: Feature[]; hidden?: boolean }) {
  return (
    <ul className={styles.list} aria-hidden={hidden || undefined}>
      {features.map((f) => (
        <li key={f.label} className={`${styles.item} ${f.top ? styles.itemTop : ''}`} style={{ width: f.w }}>
          <span className={styles.iconTile}>
            <img src={f.icon} width={14.4} height={14.4} alt="" />
          </span>
          {f.label}
        </li>
      ))}
    </ul>
  )
}

/**
 * The MCP and API page (669:28982) shows the strip with its own label and list; nothing overlaps it
 * there, so its row sits at y 39 (centred) rather than 27.
 */
export default function FeatureStrip({ variant = 'home' }: { variant?: 'home' | 'mcp' }) {
  const isStatic = useStaticMotion()
  const { label, features } = variants[variant]
  return (
    <section
      id="features"
      data-section="features"
      className={`${styles.strip} ${variant === 'mcp' ? styles.centred : ''}`}
      aria-label={label.replace(/:\s*$/, '')}
    >
      <div className={styles.row}>
        <p className={styles.label}>{label}</p>
        <div className={`${styles.viewport} ${isStatic ? '' : styles.moving}`}>
          <div className={styles.track}>
            <FeatureList features={features} />
            {!isStatic && <FeatureList features={features} hidden />}
          </div>
        </div>
      </div>
    </section>
  )
}
