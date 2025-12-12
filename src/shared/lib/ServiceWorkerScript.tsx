'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from './serviceWorker';

/**
 * Компонент для регистрации Service Worker
 * Используется в layout для активации SW на клиенте
 */
export function ServiceWorkerScript() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}


