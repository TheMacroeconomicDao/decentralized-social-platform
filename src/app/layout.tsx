import './styles/reset.scss'
import './styles/global.scss'
import './styles/global-enhanced.scss'
import type { Metadata } from 'next'
import { Montserrat, Grape_Nuts } from 'next/font/google'
import { HeaderEnhanced } from '@/widgets/Header/Header-Enhanced'
import { Navbar, NavbarMobile } from '@/widgets/Navbar'
import { Footer } from '@/widgets/Footer/Footer'
import { GlobalAnimatedBackground } from '@/shared/ui/AnimatedIcons/GlobalAnimatedBackground'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const grape_nuts = Grape_Nuts({
  subsets: ['latin'],
  weight: ['400'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gyber.org'),
  alternates: {
    canonical: '/',
  },
  title: 'Gybernaty Community',
  description: 'Gybernaty Community of advanced enthusiasts and developers',
  openGraph: {
    title: 'Gybernaty Community',
    description: 'Gybernaty Community of advanced enthusiasts and developers',
    url: 'https://gyber.org',
    images: ['/images/teams/placeholder.jpg'],
  },
  twitter: {
    title: 'Gybernaty Community',
    description: 'Gybernaty Community of advanced enthusiasts and developers',
    images: ['/images/teams/placeholder.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <GlobalAnimatedBackground />
        <HeaderEnhanced />
        <Navbar />
        {children}
        <Footer />
        <NavbarMobile />
      </body>
    </html>
  )
}
