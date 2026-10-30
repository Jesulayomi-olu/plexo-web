import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import TemplateLibrary from '../../../sections/resources/TemplateLibrary'
import Newsletter from '../../../sections/resources/Newsletter'
import { BackNav } from '../../../sections/resources/parts'
import Footer from '../../../sections/Footer'
import styles from '../../../sections/resources/page.module.css'

export const metadata: Metadata = {
  title: 'Templates — Plexo',
  description: 'Start from a proven page.',
}

type Props = { searchParams: Promise<{ from?: string }> }

// Figma "Resources" (718:9219). "Back to Resources" only after arriving from the Resources page.
export default async function TemplatesPage({ searchParams }: Props) {
  const { from } = await searchParams
  return (
    <>
      <Nav />
      <main className="page-main">
        {from === 'resources' && <BackNav href="/resources" label="Back to Resources" />}
        <section className={styles.section} aria-labelledby="templates-title">
          <TemplateLibrary />
        </section>
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
