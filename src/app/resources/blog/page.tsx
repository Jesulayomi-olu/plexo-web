import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import BlogIndex from '../../../sections/resources/BlogIndex'
import Newsletter from '../../../sections/resources/Newsletter'
import { BackNav } from '../../../sections/resources/parts'
import Footer from '../../../sections/Footer'
import styles from '../../../sections/resources/page.module.css'

export const metadata: Metadata = {
  title: 'Blog — Plexo',
  description: 'Ideas to grow your business online.',
}

type Props = { searchParams: Promise<{ from?: string; q?: string }> }

// Figma "Resources" (718:8690). "Back to Resources" shows only when the visit came from the Resources
// page (its links add ?from=resources), not from the nav menu (Figma's note on 718:9065).
export default async function BlogPage({ searchParams }: Props) {
  const { from, q } = await searchParams
  return (
    <>
      <Nav />
      <main className="page-main">
        {from === 'resources' && <BackNav href="/resources" label="Back to Resources" />}
        <section className={styles.section} aria-labelledby="blog-title">
          <BlogIndex query={q} />
        </section>
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
