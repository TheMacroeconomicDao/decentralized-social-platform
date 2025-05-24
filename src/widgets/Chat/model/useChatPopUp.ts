'use client'

import { useEffect, useState } from "react";
import chatApi, { type ClaudeResponse } from "../api/chatApi";

export interface Message {
  author: string;
  text: string;
  timestamp: number;
  avatarSrc?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = "chatPopupMessages";

export const useChatPopup = (currentUser: string = 'User') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<string>('');

  // Загружаем сохраненные сообщения при инициализации
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    }
  }, []);

  // Сохраняем сообщения при изменении
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = async (text: string): Promise<void> => {
    const userMessage: Message = {
      author: currentUser,
      text,
      timestamp: Date.now(),
      avatarSrc: undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setStreamingMessage('');

    try {
      // Отправляем сообщение напрямую через chatApi.sendMessage
      const response = await chatApi.sendMessage(text);
      
      if (response?.text) {
        const assistantMessage: Message = {
          author: 'Gybernaty AI',
          text: response.text,
          timestamp: Date.now(),
          avatarSrc: undefined
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat API error:', error);
      setError(error instanceof Error ? error.message : 'Произошла ошибка при отправке сообщения');
    } finally {
      setIsLoading(false);
      setStreamingMessage('');
    }
  };

  const clearMessages = (): void => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const retryLastMessage = async (): void => {
    if (messages.length < 2) return;
    
    const lastUserMessage = messages[messages.length - 2];
    if (lastUserMessage.author === currentUser) {
      // Удаляем последние 2 сообщения (пользователь + ассистент с ошибкой)
      setMessages(prev => prev.slice(0, -2));
      await addMessage(lastUserMessage.text);
    }
  };

  return {
    messages,
    addMessage,
    clearMessages,
    retryLastMessage,
    isLoading,
    error,
    streamingMessage
  };
};
