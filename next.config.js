/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        // Отключаем проблемное кеширование если есть
        webpackBuildWorker: false,
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
