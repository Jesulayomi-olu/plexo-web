import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Button } from '../components/Button'
import { isCaptureMode } from '../lib/motion'
import { MobileMenu } from './MobileMenu'
import { FeaturesMenu, ForYouMenu, type MenuId } from './NavMenu'
import styles from './Nav.module.css'

/**
 * Figma "Desktop navigation" (532:25146): 1440×72, #0d1a03, padding 16/80; content row (1280)
 * space-between: logo (123×32) · links (gap 24) · "Start free" (174×40).
 * "Features" and "For You" open their menus (Figma 565:2852 and 565:2838 + siblings); see NavMenu.
 *
 * Phones, Figma "Mobile navigation" (527:2679): 390×64, padding 12/20; logo (104.77×27.2) · "Start free"
 * (Size=Small) and the menu button (40×40, 20px icon), 8 apart. The button opens the full-screen menu
 * (555:2757 / 555:2816); see MobileMenu.
 */
const PANEL_ID = 'nav-mobile-panel'

/* Lucide "menu" and "x" at 20px (stroke 1.67), crossfading into each other. */
function MenuIcon() {
  return (
    <span className={styles.menuIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </span>
  )
}

/** A short pause before a menu opens on hover, so sweeping across the bar doesn't flash menus open. */
const HOVER_OPEN_DELAY = 80
/** Grace period after the pointer leaves, so a slightly wandering pointer doesn't close the menu. */
const HOVER_CLOSE_DELAY = 160

/** Which desktop menu is open, with hover timing. A ref mirrors the state for the timers. */
function useNavMenus() {
  const [menu, setMenuState] = useState<MenuId | null>(null)
  const current = useRef<MenuId | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const setMenu = useCallback((next: MenuId | null) => {
    current.current = next
    setMenuState(next)
  }, [])

  const controls = useMemo(() => {
    const clear = () => window.clearTimeout(timer.current)
    return {
      hover: (id: MenuId, inside: boolean) => {
        clear()
        if (inside && current.current) setMenu(id)
        else if (inside) timer.current = window.setTimeout(() => setMenu(id), HOVER_OPEN_DELAY)
        else timer.current = window.setTimeout(() => current.current === id && setMenu(null), HOVER_CLOSE_DELAY)
      },
      press: (id: MenuId, pointer: string) => {
        clear()
        setMenu(pointer === 'mouse' || current.current !== id ? id : null)
      },
      close: (id: MenuId) => {
        if (current.current !== id) return
        clear()
        setMenu(null)
      },
    }
  }, [setMenu])

  useEffect(() => () => window.clearTimeout(timer.current), [])
  return { menu, controls, closeAll: useCallback(() => setMenu(null), [setMenu]) }
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { menu, controls, closeAll } = useNavMenus()
  const desktopNavRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Close the desktop menus on Escape or a press anywhere outside them.
  useEffect(() => {
    if (!menu) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && closeAll()
    const onPointer = (event: PointerEvent) => {
      if (!desktopNavRef.current?.contains(event.target as Node)) closeAll()
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [menu, closeAll])

  // Subtle shadow once the page scrolls; the at-rest state is exactly the Figma bar.
  useEffect(() => {
    if (isCaptureMode) return
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the phone menu is open: the page behind can't scroll and is out of reach (inert) for focus and
  // screen readers. Esc closes it and returns focus to the menu button; so does growing past the phone
  // breakpoint.
  useEffect(() => {
    if (!open) return
    const header = headerRef.current
    const page = header ? ([...(header.parentElement?.children ?? [])].filter((el) => el !== header) as HTMLElement[]) : []
    page.forEach((el) => (el.inert = true))
    const root = document.documentElement
    const overflow = root.style.overflow
    root.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      menuButtonRef.current?.focus()
    }
    const media = window.matchMedia('(min-width: 768px)')
    const onMedia = () => media.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    media.addEventListener('change', onMedia)
    return () => {
      page.forEach((el) => (el.inert = false))
      root.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
      media.removeEventListener('change', onMedia)
    }
  }, [open])

  const close = () => setOpen(false)

  const classes = [styles.nav, isCaptureMode && styles.static, scrolled && styles.scrolled, open && styles.open]
    .filter(Boolean)
    .join(' ')

  return (
    <header ref={headerRef} id="nav" data-section="nav" className={classes}>
      <div className={styles.inner}>
        <a href="#top" className={styles.logo} aria-label="Plexo, back to top">
          <img src="/assets/v2/icons/logo-light.svg" width={123.26} height={32} alt="" />
        </a>

        <nav ref={desktopNavRef} className={styles.links} aria-label="Primary">
          <ul className={styles.list}>
            <li>
              <a href="#pricing" className={styles.link}>
                Pricing
              </a>
            </li>
            <FeaturesMenu
              open={menu === 'features'}
              controls={controls}
              triggerClassName={styles.link}
              chevronClassName={styles.chevron}
              onNavigate={closeAll}
            />
            <ForYouMenu
              open={menu === 'for-you'}
              controls={controls}
              triggerClassName={styles.link}
              chevronClassName={styles.chevron}
              onNavigate={closeAll}
            />
            <li>
              <a href="#developers" className={styles.link}>
                Resources
              </a>
            </li>
          </ul>
        </nav>

        <Button href="#start" className={styles.cta}>
          Start free
        </Button>

        <div className={styles.mobileActions}>
          <Button href="#start" size="small" className={styles.mobileCta} onClick={close}>
            Start free
          </Button>
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={PANEL_ID}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <AnimatePresence>{open && <MobileMenu id={PANEL_ID} onNavigate={close} />}</AnimatePresence>
    </header>
  )
}
