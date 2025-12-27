import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../app/styles/global-enhanced.scss';

// New advanced components
import { DynamicLighting } from '@/shared/ui/DynamicLighting/DynamicLighting';
import { ParticleSystem } from '@/shared/ui/ParticleSystem/ParticleSystem';
import { OptimizedImage } from '@/shared/ui/OptimizedImage/OptimizedImage';
import { ResponsiveContainer } from '@/shared/ui/ResponsiveContainer/ResponsiveContainer';

// Enhanced existing components
import { HeaderEnhanced } from '@/widgets/Header/Header-Enhanced';
import { NavbarEnhanced } from '@/widgets/Navbar/ui/Navbar/Navbar-Enhanced';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'DSP - Digital Symbiosis Platform 2025',
  description: 'Революционная платформа цифрового симбиоза с передовым дизайном 2025',
  keywords: ['DSP', 'Digital Symbiosis', 'Blockchain', 'AI', 'Web3', '2025'],
  authors: [{ name: 'GYBERNATY ECOSYSTEM' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#d49d32',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'DSP - Digital Symbiosis Platform 2025',
    description: 'Революционная платформа с современным дизайном',
    url: 'https://dsp.gybernaty.com',
    siteName: 'DSP Platform',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DSP Platform 2025',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DSP Platform 2025',
    description: 'Революционная платформа цифрового симбиоза',
    images: ['/twitter-image.jpg'],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function UltraEnhancedRootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="ru" className="cyber-theme-2025">
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Modern image formats preload - commented out until files exist */}
        {/* <link rel="preload" as="image" type="image/avif" href="/images/hero-bg.avif" /> */}
        {/* <link rel="preload" as="image" type="image/webp" href="/images/hero-bg.webp" /> */}
        
        {/* CSS preload for critical styles - commented out until file exists */}
        {/* <link rel="preload" href="/styles/critical.css" as="style" /> */}
        
        {/* Prefetch DNS for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.dsp.com" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* PWA capabilities */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Critical performance monitoring
              window.PERF_START = Date.now();
              
              // Preload critical resources
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
              
              // Battery API optimization
              if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                  if (battery.level < 0.2) {
                    document.documentElement.classList.add('power-save-mode');
                  }
                });
              }
            `,
          }}
        />
      </head>
      
      <body className={inter.className}>
        {/* Dynamic Lighting System - следует за курсором */}
        <DynamicLighting 
          intensity={0.4}
          radius={600}
          color="212, 157, 50"
          className="global-lighting-system"
        >
          {/* Advanced Particle System - заменяет GlobalAnimatedBackground */}
          <ParticleSystem
            particleCount={25}
            enablePhysics={true}
            enableMouse={true}
            colors={[
              'rgba(212, 157, 50, 0.8)',   // DSP Orange
              'rgba(66, 184, 243, 0.8)',   // DSP Blue
              'rgba(225, 225, 225, 0.6)',  // White
              'rgba(16, 144, 52, 0.7)',    // Green
            ]}
          />
          
          {/* Responsive Container with modern adaptivity */}
          <ResponsiveContainer
            adaptiveLayout={true}
            enableAnimations={true}
            containerType="inline-size"
            breakpoints={{
              small: 320,
              medium: 768,
              large: 1024,
              xlarge: 1440,
            }}
          >
            {/* Enhanced Navigation */}
            <NavbarEnhanced />
            
            {/* Enhanced Header with optimized images */}
            <HeaderEnhanced>
              <OptimizedImage
                src="/images/gyber_background.svg"
                alt="DSP Background"
                priority={true}
                formats={['avif', 'webp', 'jpg']}
                quality={90}
                breakpoints={[480, 768, 1024, 1440, 1920]}
                className="hero-background"
              />
            </HeaderEnhanced>
            
            {/* Main Content Area */}
            <main className="main-content-ultra">
              {children}
            </main>
            
            {/* Performance monitoring display */}
            <div className="perf-monitor" style={{ 
              position: 'fixed', 
              bottom: '10px', 
              right: '10px', 
              background: 'rgba(0,0,0,0.8)', 
              color: 'white', 
              padding: '5px 10px', 
              borderRadius: '5px', 
              fontSize: '12px',
              zIndex: 9999,
              opacity: 0.7 
            }}>
              <div id="fps-counter">FPS: --</div>
              <div id="memory-usage">Memory: --</div>
            </div>
            
          </ResponsiveContainer>
        </DynamicLighting>
        
        {/* Enhanced Performance Monitoring Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Advanced performance monitoring
              (function() {
                let fps = 0;
                let lastTime = performance.now();
                let frameCount = 0;
                
                function updatePerformanceMetrics() {
                  const now = performance.now();
                  frameCount++;
                  
                  if (now - lastTime >= 1000) {
                    fps = Math.round((frameCount * 1000) / (now - lastTime));
                    frameCount = 0;
                    lastTime = now;
                    
                    // Update FPS display
                    const fpsEl = document.getElementById('fps-counter');
                    if (fpsEl) {
                      fpsEl.textContent = 'FPS: ' + fps;
                      fpsEl.style.color = fps > 55 ? '#4ade80' : fps > 30 ? '#fbbf24' : '#ef4444';
                    }
                    
                    // Memory usage (if available)
                    if ('memory' in performance) {
                      const memoryEl = document.getElementById('memory-usage');
                      if (memoryEl) {
                        const used = Math.round(performance.memory.usedJSHeapSize / 1048576);
                        memoryEl.textContent = 'Memory: ' + used + 'MB';
                      }
                    }
                    
                    // Adaptive quality based on performance
                    if (fps < 30) {
                      document.documentElement.classList.add('low-performance-mode');
                    } else {
                      document.documentElement.classList.remove('low-performance-mode');
                    }
                  }
                  
                  requestAnimationFrame(updatePerformanceMetrics);
                }
                
                // Start monitoring after page load
                window.addEventListener('load', () => {
                  requestAnimationFrame(updatePerformanceMetrics);
                });
                
                // Hide performance monitor in production
                if (location.hostname !== 'localhost') {
                  const perfMonitor = document.querySelector('.perf-monitor');
                  if (perfMonitor) perfMonitor.style.display = 'none';
                }
                
                // Critical Web Vitals monitoring
                function reportWebVitals({name, value, id}) {
                  console.log(\`[\${name}] \${value} (id: \${id})\`);
                  
                  // Send to analytics (example)
                  if (typeof gtag !== 'undefined') {
                    gtag('event', name, {
                      event_category: 'Web Vitals',
                      value: Math.round(name === 'CLS' ? value * 1000 : value),
                      event_label: id,
                      non_interaction: true,
                    });
                  }
                }
                
                // Load Web Vitals library dynamically
                import('https://unpkg.com/web-vitals@3/dist/web-vitals.js')
                  .then(({onFCP, onLCP, onCLS, onFID, onTTFB}) => {
                    onFCP(reportWebVitals);
                    onLCP(reportWebVitals);
                    onCLS(reportWebVitals);  
                    onFID(reportWebVitals);
                    onTTFB(reportWebVitals);
                  })
                  .catch(console.error);
              })();
            `,
          }}
        />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced Service Worker with caching strategies
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async () => {
                  try {
                    const registration = await navigator.serviceWorker.register('/sw-advanced.js');
                    console.log('SW registered:', registration);
                    
                    // Handle updates
                    registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                          // Show update notification
                          if (confirm('Доступно обновление приложения. Обновить?')) {
                            window.location.reload();
                          }
                        }
                      });
                    });
                  } catch (error) {
                    console.log('SW registration failed:', error);
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
} 