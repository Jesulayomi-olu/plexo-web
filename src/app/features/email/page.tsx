import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import FeatureHero from '../../../sections/features/FeatureHero'
import Statement from '../../../sections/features/Statement'
import FeatureCards, { type FeatureCard } from '../../../sections/features/FeatureCards'
import Campaign from '../../../sections/features/Campaign'
import PricingCta from '../../../sections/pricing/PricingCta'
import Footer from '../../../sections/Footer'

export const metadata: Metadata = {
  title: 'Email & Marketing — Plexo',
  description: 'On-brand emails, signup forms and marketing campaigns, all connected to your website.',
}

const icon = (name: string) => ({ src: `/assets/features/email/${name}.svg` })

// "What You get" (736:14851), in Figma's order. Bodies without a width fill the card's padding box.
const cards: FeatureCard[] = [
  { tone: 'lime', title: 'Email designer', body: ['Create emails with a prompt or design them yourself.'], icon: icon('mail') },
  { tone: 'grey', title: 'Matching templates', body: ["Start with templates that match your website's look."], bodyWidth: 331, icon: icon('layout') },
  { tone: 'lime', title: 'Signup forms', body: ['Collect email addresses directly from your pages.'], icon: icon('form') },
  { tone: 'dark', title: 'Waitlists', body: ['Build interest and collect signups before launch.'], bodyWidth: 355, icon: icon('checklist') },
  { tone: 'grey', title: 'Sales funnels', body: ['Guide potential customers from their first visit to checkout.'], bodyWidth: 331, icon: icon('funnel') },
  { tone: 'dark', title: 'Countdown pages', body: ['Give your limited-time offers a clear deadline.'], icon: icon('timer') },
]

// Section order follows Figma "Email marketing" (736:14779) → "Main"; its hidden pricing frame is left out.
export default function EmailPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <FeatureHero
          id="email-hero"
          title={'Bring them back for more. '}
          lead="On-brand emails, signup forms and marketing campaigns, all connected to your website."
          action={{ label: 'View Templates', href: '/resources/templates', variant: 'secondary', width: 158 }}
          note=" Free for 14 days. No card."
          cardTop={61}
        />
        <Statement />
        <FeatureCards variant="email" id="what-you-get" title="What You get" cards={cards} />
        <Campaign />
        <PricingCta title={'Turn one sale into many. '} titleBox={494} sub={'Free for 14 days. No card. '} />
      </main>
      <Footer />
    </>
  )
}
