'use client'

import { Reveal } from '../../components/Reveal'
import styles from './BlockShowcase.module.css'

/**
 * Design with a Drag, "Grab a block. Drop it in." (657:25731): white, 1440×1012. A 700 column at the
 * centre: the 429-wide heading (48, two lines) and lead 80 from the top, then 40 below them the
 * 709×611 line-pattern panel (it runs 9px past the column, as in Figma) with the empty editor
 * (670×419, exported at 2×) in its centre; 80 below.
 */
export default function BlockShowcase() {
  return (
    <section id="blocks" data-section="blocks" className={styles.section} aria-labelledby="blocks-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.head}>
          {/* Figma ends the heading with a space, which counts when centring. */}
          <h2 id="blocks-title" className={styles.title}>
            Grab a block. Drop it in.&nbsp;
          </h2>
          <p className={styles.lead}>
            From hero sections to pricing tables and product galleries, pick the pieces you need, drop them onto your
            canvas, and shape them into a website that feels like you.
          </p>
        </Reveal>
        <Reveal delay={0.1} y={20} className={styles.panel}>
          <img
            src="/assets/features/drag/editor-blocks.webp"
            width={670}
            height={419}
            alt="The Plexo editor with an empty canvas, ready for blocks from the layers panel."
            className={styles.editor}
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  )
}
