/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    // Allow Turbopack (Next.js 16 default) alongside webpack config
    turbopack: {},
    experimental: {
        // Отключаем проблемное кеширование если есть
        webpackBuildWorker: false,
        // Оптимизация памяти
        optimizeCss: true,
        // Ограничиваем количество параллельных сборок (максимум 2 для экономии памяти)
        cpus: Math.min(2, Math.max(1, Math.floor(require('os').cpus().length / 2))),
    },
    // Оптимизация изображений
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        qualities: [70, 75, 85],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // Компрессия
    compress: true,
    // Оптимизация bundle
    productionBrowserSourceMaps: false,
    async headers() {
        const isDev = process.env.NODE_ENV !== 'production';
        return [
            // Security headers for all routes
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' blob:; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https: wss:; frame-src 'self' https:;"
                    },
                ],
            },
            // Static assets — immutable only in production (content-hashed filenames).
            // In dev, filenames are NOT hashed so immutable would serve stale code forever.
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: isDev
                            ? 'no-store, must-revalidate'
                            : 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // Images — long cache
            {
                source: '/images/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, stale-while-revalidate=604800',
                    },
                ],
            },
        ];
    },
    webpack: (config, { isServer, dev }) => {
        // Полифилл для indexedDB на сервере (для wagmi)
        if (isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                'indexeddb': false,
            };
        }
        
        // Dev: use default memory cache (filesystem cache can serve stale modules)
        if (dev) {
            config.optimization = {
                ...config.optimization,
                removeAvailableModules: true,
                removeEmptyChunks: true,
                mergeDuplicateChunks: true,
            };
        }
        
        // NOTE: Do NOT override splitChunks or runtimeChunk in Next.js —
        // Next.js manages its own chunk splitting for client-side routing.
        // Custom runtimeChunk: 'single' was breaking SPA navigation.
        
        // Полностью отключаем кеш webpack для production из-за нехватки места на диске
        if (!dev) {
            config.cache = false;
        }
        
        return config;
    },
}

module.exports = nextConfig
