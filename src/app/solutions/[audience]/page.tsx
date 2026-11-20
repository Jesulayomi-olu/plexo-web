import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Nav from '../../../sections/Nav'
import AudienceHero from '../../../sections/forYou/AudienceHero'
import Solutions from '../../../sections/forYou/Solutions'
import MadeForWork from '../../../sections/forYou/MadeForWork'
import { RecommendedPlan } from '../../../sections/forYou/PlanAndProof'
import { audienceById, audiences } from '../../../sections/forYou/audiences'
import Stories from '../../../sections/home/Stories'
import PricingCta from '../../../sections/pricing/PricingCta'
import Footer from '../../../sections/Footer'

type Props = { params: Promise<{ audience: string }> }

// One page, four variants: /solutions/founders, /coaches, /small-business, /designers (formerly under
// /for-you, which redirects here). /solutions/developers has its own page.
export const dynamicParams = false

export function generateStaticParams() {
  return audiences.map((a) => ({ audience: a.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const audience = audienceById((await params).audience)
  if (!audience) return {}
  return {
    title: `Plexo for ${audience.name}`,
    description: `${audience.hero.title} ${audience.hero.lead.replace(/\n/g, ' ')}`,
  }
}

// Section order follows Figma "For Founders" (571:12846) → "Main". Its "Social proof" frame (the old
// Helimax story) is replaced by the home page's stories, as the design team asked.
export default async function AudiencePage({ params }: Props) {
  const audience = audienceById((await params).audience)
  if (!audience) notFound()

  return (
    <>
      <Nav />
      <main className="page-main">
        <AudienceHero hero={audience.hero} />
        <Solutions problems={audience.problems} fixes={audience.fixes} />
        <MadeForWork work={audience.work} gap={audience.layout?.workGap} />
        <RecommendedPlan pricing={audience.pricing} />
        <Stories />
        <PricingCta title={audience.cta.title} sub={audience.cta.sub} />
      </main>
      <Footer />
    </>
  )
}
