import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";
import ScrollProgress from "@/components/ScrollProgress";

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

const TITLE = "WowCandice | Model and content creator";
const DESCRIPTION =
  "Candice is a Nigerian-Sudanese fashion and commercial model and content creator, working between London and Lagos.";
const OG_IMAGE =
  "https://res.cloudinary.com/hc8f1wui/image/upload/f_jpg,q_auto,w_1200/candice/hero/hero";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "WowCandice",
    images: [{ url: OG_IMAGE, width: 1200, height: 2609, alt: "Candice, cover portrait" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f10" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={neueMontreal.variable}>
      <body>
        <Providers>
          <ScrollProgress />
          {children}
        </Providers>
      </body>
    </html>
  );
}
