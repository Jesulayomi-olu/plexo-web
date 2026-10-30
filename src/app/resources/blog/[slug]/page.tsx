import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Nav from '../../../../sections/Nav'
import ArticleView from '../../../../sections/resources/ArticleView'
import Newsletter from '../../../../sections/resources/Newsletter'
import { BackNav } from '../../../../sections/resources/parts'
import { articles, relatedOrder } from '../../../../sections/resources/data'
import Footer from '../../../../sections/Footer'
import styles from '../../../../sections/resources/page.module.css'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  return article ? { title: `${article.title.join('').trim()} — Plexo`, description: 'From the Plexo blog.' } : {}
}

// Figma "Resources" (894:5341): one article. Every article shares Figma's placeholder body for now.
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  if (!article) notFound()

  // "Discover More Stories": Figma's three, then the rest, without the article being read.
  const ordered = [...relatedOrder, ...articles.map((a) => a.slug).filter((s) => !relatedOrder.includes(s))]
  const related = ordered
    .filter((s) => s !== slug)
    .slice(0, 3)
    .map((s) => articles.find((a) => a.slug === s)!)

  return (
    <>
      <Nav />
      <main className="page-main">
        <BackNav href="/resources/blog" label="Back to Blog" />
        <article className={styles.section}>
          <ArticleView article={article} related={related} />
        </article>
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
