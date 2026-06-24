import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Void Drift — Phase Through Dimensions',
  description:
    'A 3D browser game where you phase between three color dimensions to dodge obstacles in an infinite procedural void. Free to play, no install required.',
  metadataBase: new URL('https://voiddrift.veridux.ai'),
  openGraph: {
    title: 'Void Drift — Phase Through Dimensions',
    description: 'A 3D dimension-phasing browser game. Dodge obstacles across three color realities.',
    type: 'website',
    url: 'https://voiddrift.veridux.ai',
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
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-[#050510] text-white`}
      >
        {children}
        {/* Statcounter */}
        <Script id="statcounter-init" strategy="afterInteractive">
          {`var sc_project=13319485;var sc_invisible=1;var sc_security="4f7dc300";`}
        </Script>
        <Script id="statcounter" src="https://www.statcounter.com/counter/counter.js" strategy="afterInteractive" />
        <noscript>
          <div className="statcounter">
            <a title="Web Analytics" href="https://statcounter.com/" target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="statcounter" src="https://c.statcounter.com/13319485/0/4f7dc300/1/" alt="Web Analytics" referrerPolicy="no-referrer-when-downgrade" />
            </a>
          </div>
        </noscript>
      </body>
    </html>
  )
}
