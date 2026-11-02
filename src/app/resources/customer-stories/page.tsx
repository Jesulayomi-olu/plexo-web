import type { Metadata } from 'next'
import { Suspense } from 'react'
import Nav from '../../../sections/Nav'
import StoryLibrary from '../../../sections/resources/StoryLibrary'
import Newsletter from '../../../sections/resources/Newsletter'
import ResourceSubpage from '../../../sections/resources/ResourceSubpage'
import Footer from '../../../sections/Footer'
import styles from '../../../sections/resources/page.module.css'

export const metadata: Metadata = {
  title: 'Customer stories — Plexo',
  description: 'Real prompts. Real sites.',
}

// Figma "Resources" (718:10560). "Back to Resources" only after arriving from the Resources page.
export default function CustomerStoriesPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <Suspense fallback={<><section className={styles.section} aria-labelledby="stories-title"><StoryLibrary /></section><Newsletter /></>}>
          <ResourceSubpage kind="stories" />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
