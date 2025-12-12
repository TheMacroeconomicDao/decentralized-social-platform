import './styles/reset.scss'
import './styles/global.scss'
import './styles/global-enhanced.scss'
import type { Metadata } from 'next'
import { Montserrat, Grape_Nuts } from 'next/font/google'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { getConfig } from '@/shared/config/web3'
import { ClientHeader } from '@/widgets/Header/ClientHeader'
import { Navbar, NavbarMobile } from '@/widgets/Navbar'
import { Footer } from '@/widgets/Footer/Footer'
import { GlobalAnimatedBackground } from '@/shared/ui/AnimatedIcons/GlobalAnimatedBackground'
import { Web3Provider } from '@/app/providers/Web3Provider'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary/ErrorBoundary'
import { ServiceWorkerScript } from '@/shared/lib/ServiceWorkerScript'

// App content component that will be rendered inside Web3Provider
function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalAnimatedBackground />
      <ClientHeader />
      <Navbar />
      {children}
      <Footer />
      <NavbarMobile />
    </>
  );
}

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Hydrate wagmi state from cookies for SSR compatibility
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get('cookie')
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ServiceWorkerScript />
      </head>
      <body className={montserrat.className} suppressHydrationWarning>
        <ErrorBoundary>
          <Web3Provider initialState={initialState}>
            <AppContent>{children}</AppContent>
          </Web3Provider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
