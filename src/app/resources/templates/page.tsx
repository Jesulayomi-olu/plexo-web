import type { Metadata } from 'next'
import { Suspense } from 'react'
import Nav from '../../../sections/Nav'
import TemplateLibrary from '../../../sections/resources/TemplateLibrary'
import Newsletter from '../../../sections/resources/Newsletter'
import ResourceSubpage from '../../../sections/resources/ResourceSubpage'
import Footer from '../../../sections/Footer'
import styles from '../../../sections/resources/page.module.css'

export const metadata: Metadata = {
  title: 'Templates — Plexo',
  description: 'Start from a proven page.',
}

// Figma "Resources" (718:9219). "Back to Resources" only after arriving from the Resources page.
export default function TemplatesPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <Suspense fallback={<><section className={styles.section} aria-labelledby="templates-title"><TemplateLibrary /></section><Newsletter /></>}>
          <ResourceSubpage kind="templates" />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
