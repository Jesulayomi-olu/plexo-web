'use client'

import type { CSSProperties } from 'react'
import { useStaticMotion } from '../lib/motion'
import styles from './FeatureStrip.module.css'

/**
 * Home: Figma "Your business" (Home page V2 1166:15107): 1440×98, #d5f490. Row "Frame 23" (1280×42 at
 * 80,28, clipped): the label, then the feature list "Frame 2147239130" (gap 40), which runs past the right
 * edge. The hidden "Frame 16" and "Frame 22" are not rendered.
 * Motion: the list scrolls slowly in a loop (a ticker) and pauses on hover; reduced motion and capture
 * mode show the static Figma row.
 */
// `w`: Figma's hug width (whole pixels), so the row lands exactly where Figma puts it. `top`: in Figma
// these rows are top-aligned (text at y 0 instead of 1.5).
type Feature = { label: string; icon: string | GroupIcon; w: number; top?: boolean }

/**
 * Home icons are Figma's icon groups (stroke 1.2 at 14.4px), each placed in the 14.4 icon box where Figma
 * puts it: `x`, `y` = the group's inset less the image's outset; `w`, `h` = the SVG's own size.
 */
type GroupIcon = { src: string; x: number; y: number; w: number; h: number }

const icon = (name: string, x: number, y: number, w: number, h: number): GroupIcon => ({
  src: `/assets/v3/strip/${name}.svg`,
  x,
  y,
  w,
  h,
})

const homeFeatures: Feature[] = [
  { label: 'Website and landing pages', icon: icon('globe-code', 0.6, 0.6, 13.2, 13.2), w: 213 },
  { label: 'Email marketing', icon: icon('mail', 0.6, 1.8, 13.2002, 10.8), w: 139, top: true },
  { label: 'Sales Funnel', icon: icon('funnel', 0.6, 1.2, 13.1984, 12.6003), w: 115 },
  { label: 'Online store', icon: icon('store', 0.6, 0.6, 13.2027, 12.6), w: 114, top: true },
  { label: 'Your Domain and hosting', icon: icon('globe', 0.6, 0.6, 13.2, 13.2), w: 197 },
  // Figma's "Server icon" component now draws a form (two fields and two labels).
  { label: 'Forms and sign ups', icon: icon('form', 1.8, 0.6, 10.8, 13.2), w: 160 },
  { label: 'Blog', icon: icon('blocks', 0.6, 0.6, 13.2, 13.2), w: 64, top: true },
  { label: 'WordPress import', icon: icon('import', 0.6, 1.2, 13.2, 10.8), w: 154 },
  { label: 'Export', icon: icon('download', 1.2, 1.2, 12, 12), w: 77 },
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

function FeatureIcon({ icon }: { icon: Feature['icon'] }) {
  if (typeof icon === 'string') return <img src={icon} width={14.4} height={14.4} alt="" />
  return (
    <span className={styles.iconBox}>
      <img
        src={icon.src}
        width={icon.w}
        height={icon.h}
        alt=""
        style={{ left: icon.x, top: icon.y } as CSSProperties}
      />
    </span>
  )
}

function FeatureList({ features, hidden = false }: { features: Feature[]; hidden?: boolean }) {
  return (
    <ul className={styles.list} aria-hidden={hidden || undefined}>
      {features.map((f) => (
        <li key={f.label} className={`${styles.item} ${f.top ? styles.itemTop : ''}`} style={{ width: f.w }}>
          <span className={styles.iconTile}>
            <FeatureIcon icon={f.icon} />
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
      className={`${styles.strip} ${variant === 'mcp' ? styles.centred : styles.home}`}
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
