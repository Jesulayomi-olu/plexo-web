import { useCallback, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { durations, ease, isPreviewMode, useStaticMotion } from '../lib/motion'
import styles from './WhoItsFor.module.css'

/**
 * Figma "Who it's for" (Home page V2 532:24350; tab states of "Component 2", 238:1447):
 * Frame 30 = Small businesses (default), 31 = Coaches and creators, 32 = Agencies and freelancers,
 * 33 = Growing brands, 34 = Product teams. Photo offsets inside the cream frame differ slightly per
 * variant in Figma (x 17 or 20, y ≈ 25) and are kept as-is.
 */
const tabs = [
  {
    id: 'small-businesses',
    label: 'Small businesses',
    title: 'Turn followers into paying customers.',
    body: 'Stop taking orders in DMs. Give buyers a proper place to shop and pay.',
    bullets: ['Online store', 'Your own domain', 'Order capture'],
    cta: 'See Templates',
    href: '#canvas',
    img: '/assets/who-small-businesses.webp',
    alt: 'Small business owner checking orders on a tablet among packed shipping boxes.',
    x: 20,
    y: 25,
  },
  {
    id: 'coaches',
    label: 'Coaches and creators',
    title: 'Sell your expertise while you sleep.',
    body: 'Launch offers, grow your list and fill your programs from one page.',
    bullets: ['Sales funnels', 'Waitlists', 'Email designs'],
    cta: 'See Templates',
    href: '#canvas',
    img: '/assets/who-coaches.webp',
    alt: 'Creator recording a headphones review with her phone in a home studio.',
    x: 17,
    y: 25.14,
  },
  {
    id: 'agencies',
    label: 'Agencies and freelancers',
    title: 'Deliver more sites in less time.',
    body: 'Build client sites in days, then hand over a login they can actually use.',
    bullets: ['Reusable templates', 'Multiple sites', 'White label'],
    cta: 'See Templates',
    href: '#canvas',
    img: '/assets/who-agencies.webp',
    alt: 'Freelancer working on a laptop in a bright studio with framed posters on the wall.',
    x: 17,
    y: 25.22,
  },
  {
    id: 'growing-brands',
    label: 'Growing brands',
    title: 'Launch campaigns without the queue.',
    body: 'Spin up launch pages and promos the same day the idea lands.',
    bullets: ['Campaign pages', 'Brand consistency', 'Team access'],
    cta: 'Discover Features',
    href: '#products',
    img: '/assets/who-growing-brands.webp',
    alt: 'Marketing team gathered around a laptop reviewing campaign materials.',
    x: 20,
    y: 25.14,
  },
  {
    id: 'product-teams',
    label: 'Product teams',
    title: 'Give your users a builder.',
    body: 'Embed Plexo in your product and ship a page builder without building one.',
    bullets: ['SDK', 'API', 'Code export'],
    cta: 'Check Out Options',
    href: '#developers',
    img: '/assets/who-product-teams.webp',
    alt: 'Two colleagues discussing a project together in an office.',
    x: 20,
    y: 25,
  },
] as const

/* Cream photo frame (728×508) and photo (688×458.67) from Figma, as percentages so it scales. */
const FRAME_W = 728
const FRAME_H = 508
const PHOTO_W = 688
const PHOTO_H = 458.67

export default function WhoItsFor() {
  const [active, setActive] = useState(0)
  const isStatic = useStaticMotion()
  const uid = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const preloaded = useRef(false)

  const tab = tabs[active]
  const tabId = (i: number) => `${uid}-tab-${i}`
  const panelId = `${uid}-panel`

  const swap = isStatic ? { duration: 0 } : { duration: durations.base, ease }
  // Quick exit so the panel is never blank for long between tabs.
  const swapOut = isStatic ? { duration: 0 } : { duration: durations.fast, ease }
  const underline = isStatic ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 38 } as const

  // Warm the other photos once the visitor shows interest in the tabs, so the crossfade never waits on the network.
  const preload = useCallback(() => {
    if (preloaded.current) return
    preloaded.current = true
    tabs.forEach((t) => {
      const img = new Image()
      img.src = t.img
    })
  }, [])

  const select = (i: number, focus = false) => {
    setActive(i)
    const el = tabRefs.current[i]
    if (el) {
      if (focus) el.focus()
      // Keep the active tab visible when the row scrolls horizontally (mobile).
      const row = el.parentElement
      if (row && row.scrollWidth > row.clientWidth) {
        const left = el.offsetLeft - (row.clientWidth - el.offsetWidth) / 2
        row.scrollTo({ left, behavior: isStatic ? 'auto' : 'smooth' })
      }
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1
    let next: number | null = null
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1
    else if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next !== null) {
      e.preventDefault()
      preload()
      select(next, true)
    }
  }

  return (
    <section id="for-you" data-section="for-you" className={styles.section}>
      <div className="container">
        <Reveal className={styles.intro}>
          <h2 className={styles.heading}>Plexo Is for everyone</h2>
          <p className={styles.lead}>You don't need to be a designer, developer or tech expert to bring your ideas to life.</p>
        </Reveal>

        <div className={styles.component}>
          <Reveal delay={0.06} className={styles.tabsWrap}>
            <div
              role="tablist"
              aria-label="Business type"
              className={styles.tabs}
              onKeyDown={onKeyDown}
              onPointerEnter={preload}
              onFocus={preload}
            >
              {tabs.map((t, i) => {
                const isActive = i === active
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabRefs.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={tabId(i)}
                    aria-selected={isActive}
                    aria-controls={panelId}
                    tabIndex={isActive ? 0 : -1}
                    className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                    onClick={() => select(i)}
                  >
                    <span className={styles.tabLabel}>{t.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId={`${uid}-underline`}
                        className={styles.underline}
                        transition={underline}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </Reveal>

          <div role="tabpanel" id={panelId} aria-labelledby={tabId(active)} className={styles.panel}>
            <div className={styles.copyCol}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab.id}
                  className={styles.copy}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, transition: swapOut }}
                  transition={swap}
                >
                  <div className={styles.copyTop}>
                    <div className={styles.textBlock}>
                      <h3 className={styles.title}>{tab.title}</h3>
                      <p className={styles.body}>{tab.body}</p>
                    </div>
                    <ul className={styles.bullets}>
                      {tab.bullets.map((b) => (
                        <li key={b} className={styles.bullet}>
                          <img src="/assets/icons/seal-check.svg" alt="" width={14} height={14} className={styles.check} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="primary" href={tab.href} className={styles.cta}>
                    {tab.cta}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>

            <Reveal delay={0.12} className={styles.photoCol}>
              <div className={styles.frame}>
                <AnimatePresence initial={false}>
                  {isPreviewMode && !isStatic ? (
                    // Preview: the new photo fades in slightly zoomed and slowly settles (1.06 → 1),
                    // clipped to its own box so the cream frame stays still.
                    <motion.div
                      key={tab.id}
                      className={styles.photoClip}
                      style={{
                        left: `${(tab.x / FRAME_W) * 100}%`,
                        top: `${(tab.y / FRAME_H) * 100}%`,
                        width: `${(PHOTO_W / FRAME_W) * 100}%`,
                        height: `${(PHOTO_H / FRAME_H) * 100}%`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease }}
                    >
                      <motion.img
                        src={tab.img}
                        alt={tab.alt}
                        width={688}
                        height={459}
                        className={styles.photoZoom}
                        initial={{ scale: 1.06 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
                        decoding="async"
                        draggable={false}
                      />
                    </motion.div>
                  ) : (
                  <motion.img
                    key={tab.id}
                    src={tab.img}
                    alt={tab.alt}
                    width={688}
                    height={459}
                    className={styles.photo}
                    style={{
                      left: `${(tab.x / FRAME_W) * 100}%`,
                      top: `${(tab.y / FRAME_H) * 100}%`,
                      width: `${(PHOTO_W / FRAME_W) * 100}%`,
                      height: `${(PHOTO_H / FRAME_H) * 100}%`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={isStatic ? { duration: 0 } : { duration: durations.base + 0.15, ease }}
                    decoding="async"
                    draggable={false}
                  />
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
