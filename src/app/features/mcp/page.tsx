import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import FeatureHero from '../../../sections/features/FeatureHero'
import Mcp from '../../../sections/Mcp'
import SolSteps, { mcpSteps } from '../../../sections/sol/SolSteps'
import FeatureStrip from '../../../sections/FeatureStrip'
import DevStack from '../../../sections/features/DevStack'
import StayInCharge from '../../../sections/features/StayInCharge'
import PricingCta from '../../../sections/pricing/PricingCta'
import Footer from '../../../sections/Footer'

export const metadata: Metadata = {
  title: 'MCP and API — Plexo',
  description: 'Build from anywhere: your AI chat, your terminal or your own product. Plexo ships from all three.',
}

// Section order follows Figma "Mcp and AI" (668:27186) → "Main"; its hidden pricing frame is left out.
export default function McpPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <FeatureHero
          id="mcp-hero"
          title={'Build from anywhere.\u00a0'}
          lead="Your AI chat, your terminal or your own product. Plexo ships from all three."
          action={{ label: 'Connect Your AI', href: '#mcp', variant: 'secondary' }}
          link={{ label: 'Read the Docs', href: '#developers' }}
        />
        <Mcp variant="page" />
        <SolSteps
          variant="mcp"
          title={'Connect In\u00a0\nThree steps'}
          lead="MCP is included on Pro and Enterprise."
          steps={mcpSteps}
        />
        <FeatureStrip variant="mcp" />
        <DevStack />
        <StayInCharge />
        <PricingCta
          title={'Plug Plexo into your stack.\u00a0'}
          sub={null}
          cta={{ label: 'Read the docs', href: '#developers', variant: 'secondary' }}
          link={{ label: 'Get an API key', href: '#developers' }}
        />
      </main>
      <Footer />
    </>
  )
}
