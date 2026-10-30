import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import StoryLibrary from '../../../sections/resources/StoryLibrary'
import Newsletter from '../../../sections/resources/Newsletter'
import { BackNav } from '../../../sections/resources/parts'
import Footer from '../../../sections/Footer'
import styles from '../../../sections/resources/page.module.css'

export const metadata: Metadata = {
  title: 'Customer stories — Plexo',
  description: 'Real prompts. Real sites.',
}

type Props = { searchParams: Promise<{ from?: string }> }

// Figma "Resources" (718:10560). "Back to Resources" only after arriving from the Resources page.
export default async function CustomerStoriesPage({ searchParams }: Props) {
  const { from } = await searchParams
  return (
    <>
      <Nav />
      <main className="page-main">
        {from === 'resources' && <BackNav href="/resources" label="Back to Resources" />}
        <section className={styles.section} aria-labelledby="stories-title">
          <StoryLibrary />
        </section>
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
