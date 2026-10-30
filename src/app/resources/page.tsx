import type { Metadata } from 'next'
import Nav from '../../sections/Nav'
import ResourcesHero from '../../sections/resources/ResourcesHero'
import LatestPosts from '../../sections/resources/LatestPosts'
import Destinations from '../../sections/resources/Destinations'
import Newsletter from '../../sections/resources/Newsletter'
import Footer from '../../sections/Footer'

export const metadata: Metadata = {
  title: 'Resources — Plexo',
  description: 'Guides, templates and stories to help you sell more online.',
}

// Section order follows Figma "Resources" (683:34865) → "Resources · Hub"; its hidden back bar is left out.
export default function ResourcesPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <ResourcesHero />
        <LatestPosts />
        <Destinations />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
