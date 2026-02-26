/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
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
        return [
            // Security headers for all routes
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
                    },
                ],
            },
            // Static assets — immutable (hashed filenames)
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
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
        
        if (dev) {
            // Улучшаем стабильность кеширования в dev режиме
            config.cache = {
                type: 'filesystem',
                buildDependencies: {
                    config: [__filename],
                },
                // Добавляем более безопасные настройки
                compression: false, // Отключаем сжатие чтобы избежать проблем с rename
                // Ограничиваем размер кеша для экономии памяти
                maxMemoryGenerations: 1,
                maxAge: 1000 * 60 * 60 * 24, // 24 часа
            };
            
            // Ограничиваем количество модулей в памяти
            config.optimization = {
                ...config.optimization,
                removeAvailableModules: true,
                removeEmptyChunks: true,
                mergeDuplicateChunks: true,
            };
        }
        
        // Оптимизация для production
        if (!dev && !isServer) {
            config.optimization = {
                ...config.optimization,
                moduleIds: 'deterministic',
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name: 'vendors',
                            priority: 10,
                            reuseExistingChunk: true,
                        },
                        common: {
                            minChunks: 2,
                            priority: 5,
                            reuseExistingChunk: true,
                        },
                    },
                },
            };
        }
        
        // Полностью отключаем кеш webpack для production из-за нехватки места на диске
        if (!dev) {
            config.cache = false;
        }
        
        return config;
    },
}

module.exports = nextConfig
