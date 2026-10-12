import { useReducedMotion } from 'framer-motion'

/**
 * "Capture mode" (`?capture` in the URL) renders every element in its final
 * state with no entrance animations or autoplay, so screenshots can be
 * compared against the Figma renders pixel for pixel.
 */
export const isCaptureMode =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('capture')

/**
 * Preview mode (`?preview` in the URL) switches on motion that is still awaiting approval, so it can be
 * compared with the current site in context.
 */
export const isPreviewMode =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('preview')

/** True when animations should be skipped (reduced-motion users or capture mode). */
export function useStaticMotion(): boolean {
  const reduced = useReducedMotion()
  return Boolean(reduced) || isCaptureMode
}

/** Shared easing and durations so interactions feel consistent across sections. */
export const ease = [0.22, 1, 0.36, 1] as const
/** Slow, gentle ease-out for blur-to-focus entrances. */
export const focusEase = [0.33, 1, 0.68, 1] as const
export const durations = { fast: 0.18, base: 0.3, slow: 0.6 } as const

/** Default spring for hover lifts and small UI movements. */
export const softSpring = { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 } as const
