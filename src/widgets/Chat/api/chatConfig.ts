// Конфиг для режима чата и ключа OpenAI
// CHAT_MODE: 'puter' (по умолчанию) или 'openai' (для OpenAI API)
// OPENAI_API_KEY: хранится в GitHub secrets как NEXT_PUBLIC_OPENAI_API_KEY
// OPENAI_MODEL: используем gpt-4

export const CHAT_MODE = process.env.NEXT_PUBLIC_CHAT_MODE || 'openai'; // 'puter' | 'openai'
export const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
export const OPENAI_MODEL = 'gpt-4'; 