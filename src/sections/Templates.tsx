'use client'

import { motion } from 'framer-motion'
import { forwardRef, type CSSProperties, type KeyboardEvent } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { useCaptureMode, useStaticMotion } from '../lib/motion'
import { useGlide } from '../motion/useGlide'
import styles from './Templates.module.css'

/**
 * Figma "How it works" (598:16996) — "Start with a template": 1440×843, #fcfcfa, padding 80/0.
 * Header (heading, lead, "View all"), then a row of template screenshots (gap 39, centred, clipped,
 * square corners): 348 · 348 · 515 · 508 · 555 wide, 468 tall — it runs past both edges. Images are
 * exported at 2× (the two tallest are cut to the row's 468px, as Figma clips them).
 *
 * Motion: the row glides left in an endless loop (starting from the Figma position). Visitors can
 * take over at any time — trackpad swipe or shift + wheel, drag with a mouse or finger (with a little
 * momentum on release), or the arrow keys — and the glide pauses on hover and while they interact,
 * then resumes. Vertical scrolling always scrolls the page. Reduced motion: no glide, manual only.
 * Capture mode: the static Figma row.
 */
const templates = [
  { src: '/assets/v2/template-fieldnote.webp', w: 348, alt: 'Software template: Fieldnote, “Know why they leave, not just when.”' },
  { src: '/assets/v2/template-solene.webp', w: 348, alt: 'Skincare store template: Solène, “Skin that looks rested, not done.”' },
  { src: '/assets/v2/template-atelier-oak.webp', w: 515, alt: 'Architecture studio template: Atelier Oak, “Quiet houses, built to last a century.”' },
  { src: '/assets/v2/template-iron-grain.webp', w: 508, alt: 'Gym template: Iron & Grain, “Strength is a skill. We coach it.”' },
  { src: '/assets/v2/template-northfold.webp', w: 555, alt: 'Brand studio template: Northfold, “We make brands people remember.”' },
] as const

/** Glide speed in px/s (one 2469px loop ≈ 100s at 1440). */
const SPEED = 24
/** How long the glide waits after the visitor stops interacting (ms). */
const RESUME_AFTER = 1400
/** Copies of the row in the glide track, so the loop never shows an empty edge. */
const COPIES = 4

const TemplateRow = forwardRef<HTMLUListElement, { hidden?: boolean }>(function TemplateRow({ hidden = false }, ref) {
  return (
    <ul ref={ref} className={styles.list} aria-hidden={hidden || undefined}>
      {templates.map((t, i) => (
        <li key={i} className={styles.card} style={{ '--w': t.w } as CSSProperties}>
          <img src={t.src} width={t.w} height={468} alt={hidden ? '' : t.alt} loading="lazy" draggable={false} />
        </li>
      ))}
    </ul>
  )
})

function GlideRow({ auto }: { auto: boolean }) {
  // Figma centres one copy in a 1441-wide frame, hence the extra half pixel.
  const { viewportRef, listRef, x, nudge } = useGlide({ auto, speed: SPEED, resumeAfter: RESUME_AFTER, restOffset: 0.5 })
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      nudge(e.key === 'ArrowRight' ? 320 : -320)
    }
  }
  return (
    <div
      ref={viewportRef}
      className={`${styles.row} ${styles.glide}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Templates — drag, swipe or use the arrow keys to browse"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <motion.div className={styles.glideTrack} style={{ x }}>
        {Array.from({ length: COPIES }, (_, i) =>
          i === 1 ? <TemplateRow key={i} ref={listRef} /> : <TemplateRow key={i} hidden />,
        )}
      </motion.div>
    </div>
  )
}

export default function Templates() {
  const isStatic = useStaticMotion()
  const isCaptureMode = useCaptureMode()
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

      {isCaptureMode ? (
        <div className={styles.row}>
          <div className={styles.track}>
            <TemplateRow />
          </div>
        </div>
      ) : (
        <GlideRow auto={!isStatic} />
      )}
    </section>
  )
}
