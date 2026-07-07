import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import About from "@/components/About";
import Services from "@/components/Services";
import BrandCollaborations from "@/components/BrandCollaborations";
import Commercials from "@/components/Commercials";
import Reel from "@/components/Reel";
import BrandsSection from "@/components/BrandsSection";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <About />
      <Services />
      <BrandCollaborations />
      <Commercials />
      <Reel />
      <BrandsSection />
      <Stats />
      <Contact />
      <Footer />
    </>
  );
}
