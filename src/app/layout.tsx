import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";
import ScrollProgress from "@/components/ScrollProgress";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import { EMAIL, SOCIALS } from "@/lib/content";

/* PP Neue Montreal is the only family on the page. Bold carries the
   display type, italic carries emphasis, book carries the body. */
const neueMontreal = localFont({
  src: [
    { path: "../fonts/ppneuemontreal-book.otf", weight: "400", style: "normal" },
    { path: "../fonts/ppneuemontreal-italic.otf", weight: "400", style: "italic" },
    { path: "../fonts/ppneuemontreal-medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/ppneuemontreal-semibolditalic.otf", weight: "600", style: "italic" },
    { path: "../fonts/ppneuemontreal-bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-neue",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Candice",
    "WowCandice",
    "fashion model",
    "commercial model",
    "London model",
    "Lagos model",
    "Nigerian model",
    "Sudanese model",
    "content creator",
    "UGC creator",
    "runway model",
    "beauty model",
  ],
  authors: [{ name: "Candice", url: SITE_URL }],
  creator: "Candice",
  category: "fashion",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

/* Structured data: tells search engines who the site is about, so a
   search for her name can surface a proper profile. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Candice",
  alternateName: "WowCandice",
  url: SITE_URL,
  image: "https://res.cloudinary.com/hc8f1wui/image/upload/f_jpg,q_auto,w_1200/candice/hero/hero",
  jobTitle: "Fashion and commercial model",
  description: SITE_DESCRIPTION,
  email: `mailto:${EMAIL}`,
  nationality: [
    { "@type": "Country", name: "Nigeria" },
    { "@type": "Country", name: "Sudan" },
  ],
  workLocation: [
    { "@type": "Place", name: "London, United Kingdom" },
    { "@type": "Place", name: "Lagos, Nigeria" },
  ],
  knowsAbout: ["Fashion modeling", "Commercial modeling", "Runway", "Beauty", "Content creation"],
  sameAs: SOCIALS.filter((s) => s.name !== "WhatsApp").map((s) => s.href),
};

export const viewport: Viewport = {
  themeColor: "#0f0f10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={neueMontreal.variable}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <ScrollProgress />
          {children}
        </Providers>
      </body>
    </html>
  );
}
