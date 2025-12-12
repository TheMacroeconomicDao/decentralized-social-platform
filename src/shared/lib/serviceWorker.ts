/**
 * Service Worker регистрация и управление
 * Production-ready реализация с обработкой ошибок
 */

const isProduction = process.env.NODE_ENV === 'production';
const SW_PATH = '/sw-advanced.js';
const SW_VERSION = '2.0.0';

// Глобальные ссылки для cleanup
let updateInterval: NodeJS.Timeout | null = null;
let loadHandler: (() => void) | null = null;
let controllerChangeHandler: (() => void) | null = null;
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
        .register(SW_PATH, {
          scope: '/',
        })
        .then((registration) => {
          isRegistered = true;
          
          // Успешная регистрация
          if (isProduction) {
            // В production логируем только критические ошибки
            const updateFoundHandler = () => {
              const newWorker = registration.installing;
              if (newWorker) {
                const stateChangeHandler = () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Новый SW установлен, можно показать уведомление об обновлении
                    handleServiceWorkerUpdate(registration);
                  }
                  // Удаляем обработчик после использования
                  newWorker.removeEventListener('statechange', stateChangeHandler);
                };
                newWorker.addEventListener('statechange', stateChangeHandler);
              }
              // Удаляем обработчик после использования
              registration.removeEventListener('updatefound', updateFoundHandler);
            };
            registration.addEventListener('updatefound', updateFoundHandler);
          }

          // Очищаем предыдущий interval если есть
          if (updateInterval) {
            clearInterval(updateInterval);
          }
          
          // Проверка обновлений каждые 60 секунд
          updateInterval = setInterval(() => {
            registration.update();
          }, 60000);
        })
        .catch((error: Error) => {
          // Ошибка регистрации - логируем только в development
          if (!isProduction) {
            // eslint-disable-next-line no-console
            console.warn('Service Worker registration failed:', error);
          }
        });
    };
    
    window.addEventListener('load', loadHandler);

    // Обработка обновлений Service Worker
    if (controllerChangeHandler) {
      navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler);
    }
    
    let refreshing = false;
    controllerChangeHandler = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    
    navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler);
  }
}

/**
 * Обработка обновления Service Worker
 */
function handleServiceWorkerUpdate(registration: ServiceWorkerRegistration): void {
  // Можно показать уведомление пользователю о доступном обновлении
  // Пока просто обновляем страницу при следующем взаимодействии
  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}

/**
 * Отключение Service Worker (для тестирования)
 */
export function unregisterServiceWorker(): void {
  // Очищаем interval
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  
  // Очищаем event listeners
  if (loadHandler) {
    window.removeEventListener('load', loadHandler);
    loadHandler = null;
  }
  
  if (controllerChangeHandler) {
    navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler);
    controllerChangeHandler = null;
  }
  
  isRegistered = false;
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error: Error) => {
        if (!isProduction) {
          // eslint-disable-next-line no-console
          console.warn('Service Worker unregistration failed:', error);
        }
      });
  }
}


