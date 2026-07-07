import type { Metadata } from 'next'
import { Space_Grotesk, Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import ScrollProgress from '@/components/ScrollProgress'
import Noise from '@/components/Noise'

const spaceGrotesk = Space_Grotesk({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-display-var',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif-var',
  display: 'swap',
})

const inter = Inter({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-body-var',
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
    images: [{ url: '/media/hero/hero.png', width: 1200, height: 1600, alt: 'WowCandice' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WowCandice — Model · Creator · Muse',
    description:
      'Nigerian-Sudanese fashion & commercial model and content creator, based between London and Lagos.',
    images: ['/media/hero/hero.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <Noise />
          <ScrollProgress />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
