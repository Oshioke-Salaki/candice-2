import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrandMarquee from "@/components/BrandMarquee";
import Work from "@/components/Work";
import Commercials from "@/components/Commercials";
import About from "@/components/About";
import Digitals from "@/components/Digitals";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BrandMarquee />
        <Work />
        <Commercials />
        <About />
        <Digitals />
        <Services />
        <Stats />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
