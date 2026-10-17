import Nav from './sections/Nav'
import Hero from './sections/Hero'
import FeatureStrip from './sections/FeatureStrip'
import Steps from './sections/Steps'
import Templates from './sections/Templates'
import WhoItsFor from './sections/WhoItsFor'
import AiSection from './sections/AiSection'
import DragDrop from './sections/DragDrop'
import Mcp from './sections/Mcp'
import Developers from './sections/Developers'
import Pricing from './sections/Pricing'
import SocialProof from './sections/SocialProof'
import Faq from './sections/Faq'
import FinalCta from './sections/FinalCta'
import Footer from './sections/Footer'

// Section order follows Figma "Home page V2" (532:23980) → "Main" (532:23981).
export default function App() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <Hero />
        <FeatureStrip />
        <Steps />
        <Templates />
        <WhoItsFor />
        <AiSection />
        <DragDrop />
        <Mcp />
        <Developers />
        <Pricing />
        <SocialProof />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
