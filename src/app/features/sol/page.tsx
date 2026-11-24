import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import { SIGNUP_HREF } from '../../../sections/navData'
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
  description:
    'Type it. Sol builds it. Describe what you want in plain words. Sol turns your ideas into websites, landing pages and emails you can customise and publish.',
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
        <PricingCta title="What should Sol build first?" titleBox={null} sub={null} cta={{ label: 'Start with a Prompt', href: SIGNUP_HREF, large: true }} />
      </main>
      <Footer />
    </>
  )
}
