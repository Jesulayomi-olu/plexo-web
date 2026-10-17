import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../components/Button'
import { durations, ease, isCaptureMode, useStaticMotion } from '../lib/motion'
import styles from './Nav.module.css'

/**
 * Figma "Desktop navigation" (532:25146): 1440×72, #0d1a03, padding 16/80; content row (1280)
 * space-between: logo (123×32) · links (gap 24) · "Start free" (174×40).
 * "Features" and "For You" carry a chevron in Figma; no menus are designed, so they link to their sections.
 */
const links = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'Features', href: '#features', chevron: true },
  { label: 'For You', href: '#for-you', chevron: true },
  { label: 'Resources', href: '#developers' },
] as const

const PANEL_ID = 'nav-mobile-panel'

/* "chevron-up" (191:3635) rotated 180°: 16×16, white 1px stroke. */
function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isStatic = useStaticMotion()

  // Subtle shadow once the page scrolls; the at-rest state is exactly the Figma bar.
  useEffect(() => {
    if (isCaptureMode) return
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile panel on Escape or when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const media = window.matchMedia('(min-width: 768px)')
    const onMedia = () => media.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    media.addEventListener('change', onMedia)
    return () => {
      window.removeEventListener('keydown', onKey)
      media.removeEventListener('change', onMedia)
    }
  }, [open])

  const close = () => setOpen(false)
  const panelTransition = isStatic ? { duration: 0 } : { duration: durations.base, ease }

  const classes = [styles.nav, isCaptureMode && styles.static, scrolled && styles.scrolled, open && styles.open]
    .filter(Boolean)
    .join(' ')

  return (
    <header id="nav" data-section="nav" className={classes}>
      <div className={styles.inner}>
        <a href="#top" className={styles.logo} aria-label="Plexo, back to top">
          <img src="/assets/v2/icons/logo-light.svg" width={123.26} height={32} alt="" />
        </a>

        <nav className={styles.links} aria-label="Primary">
          <ul className={styles.list}>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                  {'chevron' in link && <Chevron />}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Button href="#start" className={styles.cta}>
          Start free
        </Button>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={PANEL_ID}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.menuIcon} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={PANEL_ID}
            className={styles.panel}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={panelTransition}
          >
            <nav aria-label="Mobile">
              <ul className={styles.panelList}>
                {links.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={isStatic ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={isStatic ? { duration: 0 } : { duration: durations.base, ease, delay: 0.04 + index * 0.04 }}
                  >
                    <a href={link.href} className={styles.panelLink} onClick={close}>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <Button href="#start" fullWidth onClick={close}>
              Start free
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
