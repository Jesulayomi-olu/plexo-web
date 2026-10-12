import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Problem from './sections/Problem'
import HowItWorks from './sections/HowItWorks'
import WhatYouGet from './sections/WhatYouGet'
import WhoItsFor from './sections/WhoItsFor'
import AiSection from './sections/AiSection'
import DragDrop from './sections/DragDrop'
import Mcp from './sections/Mcp'
import Platform from './sections/Platform'
import Developers from './sections/Developers'
import Pricing from './sections/Pricing'
import SocialProof from './sections/SocialProof'
import Faq from './sections/Faq'
import FinalCta from './sections/FinalCta'
import Footer from './sections/Footer'

// Section order follows Figma "Home page" (234:672) → "Main" (234:673).
export default function App() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <Hero />
        <Problem />
        <HowItWorks />
        <WhatYouGet />
        <WhoItsFor />
        <AiSection />
        <DragDrop />
        <Mcp />
        <Platform />
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
