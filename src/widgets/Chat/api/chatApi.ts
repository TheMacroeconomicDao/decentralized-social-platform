'use client'

import { ChatProviderManager } from './providers/ChatProviderManager';
import type { ChatMessage } from './providers/types';

// Экспортируем типы для обратной совместимости
export interface ClaudeResponse extends ChatMessage {}

// Создаем единственный экземпляр менеджера провайдеров
const chatProviderManager = new ChatProviderManager();

/**
 * Отправляет сообщение в чат и получает ответ
 * @param message - текст сообщения пользователя
 * @returns Promise с ответом от AI или null в случае ошибки
 */
const sendMessage = async (message: string): Promise<ClaudeResponse | null> => {
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    console.error('Invalid message provided to sendMessage');
    return null;
  }

  try {
    return await chatProviderManager.sendMessage(message.trim());
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return {
      author: 'Gybernaty AI',
      text: 'Произошла ошибка при отправке сообщения. Попробуйте еще раз.',
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png',
    };
  }
};

/**
 * Отправляет сообщение в чат с потоковой передачей ответа
 * @param message - текст сообщения пользователя
 * @param onChunk - callback функция для обработки частей ответа
 * @returns Promise с полным ответом от AI или null в случае ошибки
 */
const sendMessageStream = async (
  message: string,
  onChunk: (chunk: string) => void
): Promise<ClaudeResponse | null> => {
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    console.error('Invalid message provided to sendMessageStream');
    return null;
  }

  if (typeof onChunk !== 'function') {
    console.error('Invalid onChunk callback provided to sendMessageStream');
    return sendMessage(message); // Fallback к обычному сообщению
  }

  try {
    return await chatProviderManager.sendMessageStream(message.trim(), onChunk);
  } catch (error) {
    console.error('Error in sendMessageStream:', error);
    return {
      author: 'Gybernaty AI',
      text: 'Произошла ошибка при потоковой передаче. Попробуйте еще раз.',
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png',
    };
  }
};

/**
 * Получает название текущего активного провайдера
 * @returns строка с названием провайдера
 */
const getCurrentProvider = (): string => {
  return chatProviderManager.getCurrentProviderName();
};

/**
 * Сбрасывает текущий провайдер для повторного выбора
 * Полезно если нужно переключиться на другой провайдер
 */
const resetProvider = (): void => {
  chatProviderManager.resetProvider();
};

// Экспортируем API
export default {
  sendMessage,
  sendMessageStream,
  getCurrentProvider,
  resetProvider,
};

// Именованные экспорты для удобства
export {
  sendMessage,
  sendMessageStream,
  getCurrentProvider,
  resetProvider,
};