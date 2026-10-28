import Nav from '../../sections/Nav'
import PricingOverview from '../../sections/pricing/PricingOverview'
import FeatureTable from '../../sections/pricing/FeatureTable'
import CreditsGuarantee from '../../sections/pricing/CreditsGuarantee'
import Faq from '../../sections/Faq'
import PricingCta from '../../sections/pricing/PricingCta'
import Footer from '../../sections/Footer'
import { pageMetadata } from '../../lib/metadata'

export const metadata = pageMetadata(
  'Pricing — Plexo',
  'Simple pricing, real results. Start free for 14 days and pay only when your site goes live.',
  '/pricing',
)

// Section order follows Figma "Pricing Main" (571:11307).
export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <PricingOverview />
        <FeatureTable />
        <CreditsGuarantee />
        <Faq />
        <PricingCta />
      </main>
      <Footer />
    </>
  )
}
