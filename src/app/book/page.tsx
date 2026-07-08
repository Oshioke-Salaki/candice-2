import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { PageCta } from "@/components/PageHeader";
import BookGallery from "@/components/BookGallery";

export const metadata: Metadata = {
  title: "The Book — WowCandice",
  description:
    "The full modeling book — fashion editorials, commercial campaigns and off-duty frames by Candice.",
};

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          tag="Modeling Portfolio"
          lineOne="THE"
          lineTwo="BOOK"
          subline="Every frame tells a story — fashion, commercial, and everything off duty."
          note="24 frames · Lagos ✶ London ✶ Paris"
        />
        <BookGallery />
        <PageCta />
      </main>
      <Footer />
    </>
  );
}
