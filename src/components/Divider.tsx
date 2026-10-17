import styles from './Divider.module.css'

/**
 * Figma "Divider 1 " (Home page V2): a 6px band with a full-width 1px dashed line (#7a7b77, 8/8)
 * 4px down, and a star ornament at each content edge, where the dashed guide lines cross it.
 * At 1440 the stars sit at x 76 (y −3) and x 1353 (y −2), i.e. 4px left of the left content edge
 * and 7px left of the right one. Decorative.
 */
export function Divider({ className }: { className?: string }) {
  return (
    <div className={[styles.divider, className].filter(Boolean).join(' ')} aria-hidden="true">
      <span className={styles.line} />
      <span className={styles.edges}>
        <img className={styles.starLeft} src="/assets/v2/icons/star.svg" width={12} height={12} alt="" />
        <img className={styles.starRight} src="/assets/v2/icons/star.svg" width={12} height={12} alt="" />
      </span>
    </div>
  )
}
