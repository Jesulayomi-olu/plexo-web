'use client'

import { Reveal } from '../../components/Reveal'
import styles from './Statement.module.css'

/**
 * Email & Marketing "Solutions" (736:14813): 1440×300, white, padding 80/80/40; one centred 1054-wide
 * paragraph of 600 40/60 (−1) that wraps to three lines at 1440: the problem in #5b5b58, then the
 * answer in #121212.
 */
export default function Statement() {
  return (
    <section data-section="statement" className={styles.section}>
      <div className="container">
        <Reveal>
          <p className={styles.text}>
            <span className={styles.muted}>Most visitors leave without buying.</span> Plexo helps you collect their email and
            follow up with the right message, giving them another reason to come back.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
