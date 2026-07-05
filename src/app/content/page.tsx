import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Stats from "@/components/Stats";
import PageHeader, { PageCta } from "@/components/PageHeader";
import ContentGrid from "@/components/ContentGrid";

export const metadata: Metadata = {
  title: "In Motion — WowCandice",
  description:
    "Reels, runway and press — the content side of Candice. 3.5M+ views in 30 days.",
};

export default function ContentPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          tag="Content & Reels"
          lineOne="IN"
          lineTwo="MOTION"
          subline="The camera stops. The work doesn't. Tap a frame to press play."
          note="Hover or tap to play · sound on select reels"
        />
        <ContentGrid />
        <Stats />
        <PageCta />
      </main>
      <Footer />
    </>
  );
}
