import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import SolHero from '../../../sections/sol/SolHero'
import SolSteps from '../../../sections/sol/SolSteps'
import LiveBuild from '../../../sections/sol/LiveBuild'
import SolFeatures from '../../../sections/sol/SolFeatures'
import SolCredits from '../../../sections/sol/SolCredits'
import Faq from '../../../sections/Faq'
import PricingCta from '../../../sections/pricing/PricingCta'
import Footer from '../../../sections/Footer'

export const metadata: Metadata = {
  title: 'Build with Sol — Plexo',
  description: 'Type it. Sol builds it. Describe your business in plain words and get a live site with copy, images and checkout.',
}

// Section order follows Figma "Build with Sol" (575:15481) → "Main". Its hidden "Recommended plan" frame is left out.
export default function SolPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <SolHero />
        <SolSteps />
        <LiveBuild />
        <SolFeatures />
        <SolCredits />
        <Faq variant="sol" />
        <PricingCta title="What should Sol build first?" titleBox={null} sub={null} cta={{ label: 'Start with a Prompt', href: '#top', large: true }} />
      </main>
      <Footer />
    </>
  )
}
