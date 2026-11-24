import type { Metadata } from 'next'
import { Suspense } from 'react'
import Nav from '../../../sections/Nav'
import BlogIndex from '../../../sections/resources/BlogIndex'
import Newsletter from '../../../sections/resources/Newsletter'
import ResourceSubpage from '../../../sections/resources/ResourceSubpage'
import Footer from '../../../sections/Footer'
import styles from '../../../sections/resources/page.module.css'

export const metadata: Metadata = {
  title: 'Blog — Plexo',
  description: 'Ideas to grow your business online.',
}

// Figma "Resources" (718:8690). "Back to Resources" shows only when the visit came from the Resources
// page (its links add ?from=resources), not from the nav menu (Figma's note on 718:9065).
export default function BlogPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <Suspense fallback={<><section className={styles.section} aria-labelledby="blog-title"><BlogIndex /></section><Newsletter /></>}>
          <ResourceSubpage kind="blog" />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
