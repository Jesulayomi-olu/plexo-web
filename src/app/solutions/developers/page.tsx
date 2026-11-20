import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import DeveloperHero from '../../../sections/forYou/DeveloperHero'
import DeveloperTools from '../../../sections/forYou/DeveloperTools'
import PricingCta from '../../../sections/pricing/PricingCta'
import Footer from '../../../sections/Footer'

export const metadata: Metadata = {
  title: 'Plexo for Developers',
  description:
    "Prompt from your terminal. Use Plexo's SDK, API and MCP server to create, customise and publish websites and emails from your own development environment or AI tools.",
}

// Section order follows Figma "For Developers" (1042:19374) → "Main".
export default function DevelopersPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <DeveloperHero />
        <DeveloperTools />
        <PricingCta
          title="Ready to build with Plexo?"
          sub="Connect your tools and start building."
          // No docs site yet: the button is shown as in Figma but doesn't lead anywhere for now.
          cta={{ label: 'Explore documentation' }}
        />
      </main>
      <Footer />
    </>
  )
}
