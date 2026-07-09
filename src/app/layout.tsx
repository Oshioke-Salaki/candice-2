import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Anton, DM_Sans } from 'next/font/google'
import './globals.css'

/* Anton — heavy condensed grotesque; the all-caps display face that
   gives every heading its poster-scale impact. */
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

/* DM Sans — highly legible humanist sans for readable body copy. */
const dmSans = DM_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
})
import ScrollProgress from '@/components/ScrollProgress'
import Noise from '@/components/Noise'

/* PP Neue Montreal — the house grotesque. One family drives both the
   display headings and the body text. */
const neueMontreal = localFont({
  src: [
    { path: '../fonts/ppneuemontreal-thin.otf', weight: '100', style: 'normal' },
    { path: '../fonts/ppneuemontreal-book.otf', weight: '400', style: 'normal' },
    { path: '../fonts/ppneuemontreal-italic.otf', weight: '400', style: 'italic' },
    { path: '../fonts/ppneuemontreal-medium.otf', weight: '500', style: 'normal' },
    { path: '../fonts/ppneuemontreal-semibolditalic.otf', weight: '600', style: 'italic' },
    { path: '../fonts/ppneuemontreal-bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-neue',
  display: 'swap',
})

/* Zodiak — sharp editorial serif; its italic carries the elegant
   accents (WOW, pull-quotes, captions) with edge instead of curls. */
const zodiak = localFont({
  src: [
    { path: '../fonts/Zodiak-Variable.woff2', weight: '400 900', style: 'normal' },
    { path: '../fonts/Zodiak-VariableItalic.woff2', weight: '400 900', style: 'italic' },
  ],
  variable: '--font-serif-var',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WowCandice — Model · Creator · Muse',
  description:
    'Candice — Nigerian-Sudanese fashion & commercial model and content creator, based between London and Lagos. Editorials, campaigns, runway, and scroll-stopping stories.',
  openGraph: {
    title: 'WowCandice — Model · Creator · Muse',
    description:
      'Nigerian-Sudanese fashion & commercial model and content creator, based between London and Lagos.',
    siteName: 'WowCandice',
    images: [
      {
        url: 'https://res.cloudinary.com/hc8f1wui/image/upload/f_jpg,q_auto,w_1200/candice/hero/hero',
        width: 1200,
        height: 2609,
        alt: 'WowCandice',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WowCandice — Model · Creator · Muse',
    description:
      'Nigerian-Sudanese fashion & commercial model and content creator, based between London and Lagos.',
    images: [
      'https://res.cloudinary.com/hc8f1wui/image/upload/f_jpg,q_auto,w_1200/candice/hero/hero',
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${neueMontreal.variable} ${anton.variable} ${zodiak.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Noise />
        <ScrollProgress />
        {children}
      </body>
    </html>
  )
}
