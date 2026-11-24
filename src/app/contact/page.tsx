import type { Metadata } from 'next'
import Nav from '../../sections/Nav'
import PageHero from '../../sections/PageHero'
import ContactOptions from '../../sections/contact/ContactOptions'
import Faq from '../../sections/Faq'
import Newsletter from '../../sections/resources/Newsletter'
import Footer from '../../sections/Footer'

export const metadata: Metadata = {
  title: 'Get in touch — Plexo',
  description:
    'Have questions about Plexo, need help getting started, or want to explore how it can work for your business? Reach out to our team.',
}

// Section order follows Figma "Resources" (1349:8580), the Get in touch page. Its FAQ is the home page's
// (the 14 questions with "See more"), at the design team's request, in place of the 9 in the frame.
export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <PageHero
          section="contact-hero"
          title="Get in touch with us"
          lead="Have questions about Plexo, need help getting started, or want to explore how it can work for your business? We'd love to hear from you. Reach out to our team and we'll be happy to help."
        />
        <ContactOptions />
        <Faq />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
