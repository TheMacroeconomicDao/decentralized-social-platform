// Конфигурация чата для новой безопасной архитектуры
// Теперь все API вызовы идут через серверный endpoint /api/chat
// OpenAI API ключ хранится только на сервере как OPENAI_API_KEY (без NEXT_PUBLIC_)

// Режим работы чата (для будущих расширений)
export const CHAT_MODE = 'server'; // Всегда используем серверный API

// Настройки для клиента
export const CHAT_CONFIG = {
  maxMessageLength: 4000,
  apiEndpoint: '/api/chat',
  fallbackProvider: 'puter', // Fallback если сервер недоступен
} as const; 