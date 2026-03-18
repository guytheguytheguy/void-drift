import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Void Drift — Phase Through Dimensions',
  description:
    'A 3D browser game where you phase between three color dimensions to dodge obstacles in an infinite procedural void. Free to play, no install required.',
  metadataBase: new URL('https://voiddrift.dev'),
  openGraph: {
    title: 'Void Drift — Phase Through Dimensions',
    description: 'A 3D dimension-phasing browser game. Dodge obstacles across three color realities.',
    type: 'website',
    url: 'https://voiddrift.dev',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Void Drift',
    description: 'Phase through dimensions. Drift through the void.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050510] text-white`}
      >
        {children}
      </body>
    </html>
  )
}
