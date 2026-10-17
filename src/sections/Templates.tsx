import type { CSSProperties } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { useStaticMotion } from '../lib/motion'
import styles from './Templates.module.css'

/**
 * Figma "How it works" (532:24295) — "Start with a template": 1440×843, #fcfcfa, padding 80/0.
 * Header (heading, lead, "View all"), then a row of template previews (gap 39, centred, clipped):
 * 601 · 204 · 518 · 204 wide, 468 tall, r20.22 — it runs past both edges.
 * Motion: the row glides left in a slow loop and pauses on hover; reduced motion and capture mode
 * show the static, centred Figma row.
 */
const templates = [
  { src: '/assets/v2/template-wedding.webp', w: 601, alt: 'Wedding website template: Jude & Jane are getting married' },
  { src: '/assets/v2/template-summer.webp', w: 204, alt: 'Mobile store template: Your Summer starts here' },
  { src: '/assets/v2/template-glow.webp', w: 518, alt: 'Skincare store template: Glow by Amy' },
  { src: '/assets/v2/template-summer.webp', w: 204, alt: 'Mobile store template: Your Summer starts here' },
] as const

function TemplateRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className={styles.list} aria-hidden={hidden || undefined}>
      {templates.map((t, i) => (
        <li key={i} className={styles.card} style={{ '--w': t.w } as CSSProperties}>
          <img src={t.src} width={t.w} height={468} alt={hidden ? '' : t.alt} loading="lazy" />
        </li>
      ))}
    </ul>
  )
}

export default function Templates() {
  const isStatic = useStaticMotion()
  return (
    <section id="templates" data-section="templates" className={styles.section}>
      <div className={styles.head}>
        <Reveal className={styles.headText}>
          <h2 className="h2 baseline-fix">Start with a template</h2>
          <p className={`baseline-fix ${styles.lead}`}>
            From your first idea to a published website, Plexo gives you everything you need to build, customise and
            launch in one place.
          </p>
        </Reveal>
        <Reveal delay={0.08} className={styles.cta}>
          <Button href="#start">View all</Button>
        </Reveal>
      </div>

      <div className={`${styles.row} ${isStatic ? '' : styles.moving}`}>
        <div className={styles.track}>
          <TemplateRow />
          {!isStatic && <TemplateRow hidden />}
        </div>
      </div>
    </section>
  )
}
