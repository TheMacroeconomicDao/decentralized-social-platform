/**
 * Service Worker регистрация и управление
 * Production-ready реализация с обработкой ошибок
 */

const isProduction = process.env.NODE_ENV === 'production';
const SW_PATH = '/sw-advanced.js';

// Глобальные ссылки для cleanup
let updateInterval: NodeJS.Timeout | null = null;
let loadHandler: (() => void) | null = null;
let isRegistered = false;

/**
 * Регистрация Service Worker
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;

  // Предотвращаем множественную регистрацию
  if (isRegistered) return;

  // Регистрируем только в production или если явно включено
  if (!isProduction && !process.env.NEXT_PUBLIC_ENABLE_SW) {
    return;
  }

  if ('serviceWorker' in navigator) {
    // Очищаем предыдущие обработчики если есть
    if (loadHandler) {
      window.removeEventListener('load', loadHandler);
    }

    loadHandler = () => {
      navigator.serviceWorker
        .register(SW_PATH, { scope: '/' })
        .then((registration) => {
          isRegistered = true;

          if (isProduction) {
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    handleServiceWorkerUpdate(registration);
                  }
                }, { once: true });
              }
            }, { once: true });
          }

          // Очищаем предыдущий interval если есть
          if (updateInterval) {
            clearInterval(updateInterval);
          }

          // Проверка обновлений каждые 5 минут (не 60 секунд)
          updateInterval = setInterval(() => {
            registration.update().catch(() => {
              // Silently ignore update errors (InvalidStateError, etc.)
            });
          }, 300000);
        })
        .catch(() => {
          // Silently fail — SW is non-critical
        });
    };

    window.addEventListener('load', loadHandler);

    // NOTE: removed controllerchange → window.location.reload()
    // It was causing unexpected full-page reloads during SPA navigation
  }
}

/**
 * Обработка обновления Service Worker
 */
function handleServiceWorkerUpdate(registration: ServiceWorkerRegistration): void {
  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}

/**
 * Отключение Service Worker
 */
export function unregisterServiceWorker(): void {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }

  if (loadHandler) {
    window.removeEventListener('load', loadHandler);
    loadHandler = null;
  }

  isRegistered = false;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch(() => {
        // Silently fail
      });
  }
}
