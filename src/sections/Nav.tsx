import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../components/Button'
import { durations, ease, isCaptureMode, useStaticMotion } from '../lib/motion'
import styles from './Nav.module.css'

/** Figma "Desktop navigation" (234:2134). `width` = Figma text box width (min-width keeps the 1440 layout exact). */
const links = [
  { label: 'Products', href: '#products', width: 62 },
  { label: 'Developers', href: '#developers', width: 77 },
  { label: 'FAQ', href: '#faq', width: 29 },
  { label: 'Pricing', href: '#pricing', width: 46 },
] as const

const PANEL_ID = 'nav-mobile-panel'

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
          Plexo
        </a>

        <nav className={styles.links} aria-label="Primary">
          <ul className={styles.list}>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link} style={{ minWidth: link.width }}>
                  {link.label}
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
