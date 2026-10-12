import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Uniform scale for fixed-width Figma compositions (e.g. a 1280px product panel).
 * On desktop (≥ `minWidth`) the composition is laid out at its design width and scaled to fit the
 * available width, so every part (images, cards, text) shrinks together and keeps the design's
 * proportions. Returns scale 1 and `fitted: false` below `minWidth`, where sections use their own
 * responsive layout instead.
 */
export function useFitScale<T extends HTMLElement>(designWidth: number, minWidth = 1200) {
  const ref = useRef<T>(null)
  const [state, setState] = useState({ scale: 1, fitted: true })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const media = window.matchMedia(`(min-width: ${minWidth}px)`)
    const update = () => {
      const fitted = media.matches
      setState({ scale: fitted ? Math.min(1, el.clientWidth / designWidth) : 1, fitted })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    media.addEventListener('change', update)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', update)
    }
  }, [designWidth, minWidth])

  return { ref, ...state }
}
