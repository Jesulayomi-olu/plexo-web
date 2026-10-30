import { useLayoutEffect, useMemo, useState } from 'react'

/** A callback ref that also exposes `.current`, so it can be passed to hooks that expect a ref object. */
type FitRef<T> = ((node: T | null) => void) & { current: T | null }

/**
 * Uniform scale for fixed-width Figma compositions (e.g. a 1280px product panel).
 * On desktop (≥ `minWidth`) the composition is laid out at its design width and scaled to fit the
 * available width, so every part (images, cards, text) shrinks together and keeps the design's
 * proportions. Returns scale 1 and `fitted: false` below `minWidth`, where sections use their own
 * responsive layout instead.
 *
 * The ref follows its element: a wrapper may swap the measured node after hydration (Reveal renders a
 * plain element instead of a motion one in capture mode or for reduced motion), and the old, detached
 * node must not leave the scale at 0.
 */
export function useFitScale<T extends HTMLElement>(designWidth: number, minWidth = 1200) {
  const [el, setEl] = useState<T | null>(null)
  const [state, setState] = useState({ scale: 1, fitted: true })

  const ref = useMemo(() => {
    const fn = ((node: T | null) => {
      fn.current = node
      setEl(node)
    }) as FitRef<T>
    fn.current = null
    return fn
  }, [])

  useLayoutEffect(() => {
    if (!el) return
    const media = window.matchMedia(`(min-width: ${minWidth}px)`)
    const update = () => {
      const fitted = media.matches
      const width = el.clientWidth
      // Hidden (display: none) or detached: keep the last scale until it has a width again.
      setState((last) => ({ scale: !fitted ? 1 : width === 0 ? last.scale : Math.min(1, width / designWidth), fitted }))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    media.addEventListener('change', update)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', update)
    }
  }, [el, designWidth, minWidth])

  return { ref, ...state }
}
