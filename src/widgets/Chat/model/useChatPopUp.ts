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
  needsConsent: boolean;
}

const STORAGE_KEY = "chatPopupMessages";

export const useChatPopup = (currentUser: string = 'User') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [needsConsent, setNeedsConsent] = useState<boolean>(false);

  // Check consent on mount
  useEffect(() => {
    setNeedsConsent(!chatApi.hasUserConsent());
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedMessages = JSON.parse(saved);
        setMessages(Array.isArray(parsedMessages) ? parsedMessages : []);
      } catch {
        localStorage.removeItem(STORAGE_KEY); // Clean corrupted data
        setMessages([]);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Handle user consent
  const handleConsent = (accepted: boolean) => {
    if (accepted) {
      chatApi.saveUserConsent();
      setNeedsConsent(false);
      setError(null);
    } else {
      setNeedsConsent(true);
      setError("Gybernaty AI requires consent to provide assistance.");
    }
  };

  // Add user message and get Claude response
  const addMessage = async (text: string) => {
    if (!text.trim()) return;

    // Check consent before proceeding
    if (!chatApi.hasUserConsent()) {
      setNeedsConsent(true);
      setError("Please accept the terms to use Gybernaty AI.");
      return;
    }

    const userMessage: Message = {
      author: currentUser,
      text: text.trim(),
      timestamp: Date.now(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setStreamingMessage('');

    try {
      // For short messages, use regular API
      if (text.length < 100) {
        const response = await chatApi.sendMessage(text);
        
        if (response) {
          setMessages((prev) => [...prev, response]);
        } else {
          setError("Failed to get response from Gybernaty AI");
        }
      } else {
        // For longer messages, use streaming
        let streamingResponse = '';
        const streamingId = Date.now();
        
        // Add placeholder for streaming message
        const placeholderMessage: Message = {
          author: 'Gybernaty AI',
          text: '',
          timestamp: streamingId,
          avatarSrc: '/gybernaty-ai-avatar.png'
        };
        
        setMessages((prev) => [...prev, placeholderMessage]);
        
        const response = await chatApi.sendMessageStream(text, (chunk) => {
          streamingResponse += chunk;
          setStreamingMessage(streamingResponse);
          
          // Update the placeholder message
          setMessages((prev) => 
            prev.map(msg => 
              msg.timestamp === streamingId 
                ? { ...msg, text: streamingResponse }
                : msg
            )
          );
        });

        setStreamingMessage('');
      }

    } catch (error) {
      console.error('Error in chat:', error);
      
      // Handle consent error specifically
      if (error instanceof Error && error.message === 'User consent required') {
        setNeedsConsent(true);
        setError("Please accept the terms to use Gybernaty AI.");
        // Remove the user message since it wasn't processed
        setMessages((prev) => prev.slice(0, -1));
        return;
      }
      
      setError("Sorry, something went wrong. Please try again.");
      
      // Add error message
      const errorMessage: Message = {
        author: 'Gybernaty AI',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
        avatarSrc: '/gybernaty-ai-avatar.png'
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setError(null);
  };

  // Retry last message
  const retryLastMessage = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      if (lastUserMessage.author === currentUser) {
        // Remove last Claude response and retry
        setMessages(prev => prev.slice(0, -1));
        addMessage(lastUserMessage.text);
      }
    }
  };

  // Reset consent (for testing or user preference)
  const resetConsent = () => {
    chatApi.removeUserConsent();
    setNeedsConsent(true);
    setError(null);
  };

  return { 
    messages, 
    addMessage, 
    clearMessages,
    retryLastMessage,
    handleConsent,
    resetConsent,
    isLoading, 
    error,
    streamingMessage,
    needsConsent
  };
};
