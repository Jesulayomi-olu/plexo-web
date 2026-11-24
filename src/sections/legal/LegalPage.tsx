import type { Metadata } from 'next'
import Nav from '../Nav'
import PageHero from '../PageHero'
import Footer from '../Footer'
import LegalDocument from './LegalDocument'
import { legalDoc, type LegalSlug } from './content'

export function legalMetadata(slug: LegalSlug): Metadata {
  const doc = legalDoc(slug)
  return { title: `${doc.title} — Plexo`, description: doc.intro }
}

/** A legal page: the nav, the compact dark hero (title and intro), the document, the footer. */
export default function LegalPage({ slug }: { slug: LegalSlug }) {
  const doc = legalDoc(slug)
  return (
    <>
      <Nav />
      <main className="page-main">
        <PageHero section="legal-hero" title={doc.title} lead={doc.intro} compact />
        <LegalDocument doc={doc} />
      </main>
      <Footer />
    </>
  )
}
