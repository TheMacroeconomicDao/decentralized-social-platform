/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        // Отключаем проблемное кеширование если есть
        webpackBuildWorker: false,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
                    },
                ],
            },
        ];
    },
    webpack: (config, { isServer, dev }) => {
        if (dev) {
            // Улучшаем стабильность кеширования в dev режиме
            config.cache = {
                type: 'filesystem',
                buildDependencies: {
                    config: [__filename],
                },
                // Добавляем более безопасные настройки
                compression: false, // Отключаем сжатие чтобы избежать проблем с rename
            };
        }
        return config;
    },
}

module.exports = nextConfig
