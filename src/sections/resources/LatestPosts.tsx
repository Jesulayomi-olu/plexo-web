import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { articles } from './data'
import { ArticleCard } from './parts'
import styles from './LatestPosts.module.css'

/**
 * Resources hub "Hero" (718:8003): #f0f6df, padding 100/80, gap 40. "Latest From The Blog" and its line
 * beside the Secondary "Read More" (with an arrow), then three article cards 33 apart. Figma repeats one
 * article three times as a placeholder; the three newest articles are shown instead.
 */
export default function LatestPosts() {
  return (
    <section data-section="latest-posts" className={styles.section} aria-labelledby="latest-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.head}>
          <div className={styles.text}>
            <h2 id="latest-title" className={styles.title}>
              Latest From The Blog
            </h2>
            <p className={styles.lead}>Ideas to grow your business online.</p>
          </div>
          <Button
            href="/resources/blog"
            variant="secondary"
            className={styles.cta}
            trailingIcon={<img src="/assets/resources/arrow-right-white.svg" width={16} height={16} alt="" />}
          >
            Read More
          </Button>
        </Reveal>
        <div className={styles.cards}>
          {articles.slice(0, 3).map((article, i) => (
            <Reveal key={article.slug} delay={0.06 * i} className={styles.cardSlot}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
