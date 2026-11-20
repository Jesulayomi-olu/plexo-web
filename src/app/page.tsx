import Nav from '../sections/Nav'
import Hero from '../sections/Hero'
import FeatureStrip from '../sections/FeatureStrip'
import BuildWithAi from '../sections/home/BuildWithAi'
import CreateModes from '../sections/home/CreateModes'
import Audiences from '../sections/home/Audiences'
import WordPress from '../sections/home/WordPress'
import Stories from '../sections/home/Stories'
import Pricing from '../sections/Pricing'
import Faq from '../sections/Faq'
import FinalCta from '../sections/FinalCta'
import Footer from '../sections/Footer'

// Section order follows Figma "Home page V2" (1166:14994) on Page 3.
export default function Home() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <Hero />
        <FeatureStrip />
        <BuildWithAi />
        <CreateModes />
        <Audiences />
        <WordPress />
        <Stories />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
