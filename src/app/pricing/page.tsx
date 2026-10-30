import type { Metadata } from 'next'
import Nav from '../../sections/Nav'
import PricingOverview from '../../sections/pricing/PricingOverview'
import FeatureTable from '../../sections/pricing/FeatureTable'
import CreditsGuarantee from '../../sections/pricing/CreditsGuarantee'
import Faq from '../../sections/Faq'
import PricingCta from '../../sections/pricing/PricingCta'
import Footer from '../../sections/Footer'

export const metadata: Metadata = {
  title: 'Pricing — Plexo',
  description: 'Simple pricing, real results. Start free for 14 days and pay only when your site goes live.',
}

// Section order follows Figma "Pricing Main" (571:11307).
export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <PricingOverview />
        <FeatureTable />
        <CreditsGuarantee />
        <Faq variant="pricing" />
        <PricingCta />
      </main>
      <Footer />
    </>
  )
}
