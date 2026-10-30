import { Reveal } from '../../components/Reveal'
import { destinations } from './data'
import styles from './Destinations.module.css'

/**
 * Resources hub "Destinations" (718:7942): white, padding 80/80/100; six 410-wide cards (gap 24) — a
 * 48px icon tile with a 24px green icon, the title (600 24/30), the promise (500 16/24) and a detail
 * (14/21, #5b5b58), then "View all" (600 14, #517a12) with an arrow. Cards with somewhere to go link
 * there (with `?from=resources`, so those pages offer the way back); Help center, Developer docs and
 * Changelog have no page yet and are not links.
 */
export default function Destinations() {
  return (
    <section data-section="destinations" className={styles.section} aria-label="Resources">
      <div className={`container ${styles.grid}`}>
        {destinations.map((item, i) => {
          const { src, w, h, x, y } = item.icon
          const content = (
            <>
              <span className={styles.iconTile} aria-hidden="true">
                <span className={styles.iconFrame}>
                  <img src={`/assets/resources/${src}.svg`} width={w} height={h} alt="" style={{ left: x, top: y }} />
                </span>
              </span>
              <span className={styles.text}>
                <span className={styles.title}>{item.label}</span>
                <span className={styles.promise}>{item.description}</span>
                <span className={styles.detail}>{item.detail}</span>
              </span>
              <span className={styles.link}>
                View all
                <img src="/assets/resources/arrow-right-green.svg" width={16} height={16} alt="" />
              </span>
            </>
          )
          return (
            <Reveal key={item.label} delay={0.05 * i} className={styles.slot}>
              {item.href ? (
                <a href={`${item.href}?from=resources`} className={`${styles.card} ${styles.linked}`}>
                  {content}
                </a>
              ) : (
                <div className={styles.card}>{content}</div>
              )}
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
