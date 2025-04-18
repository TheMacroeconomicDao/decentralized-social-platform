'use client'

import { useEffect, useState } from "react";
import chatApi from "../api/chatApi"
export interface Message {
  author: string;
  text: string;
  timestamp: number;
  avatarSrc?: string;
}

const STORAGE_KEY = "chatPopupMessages";

export const useChatPopup = (currentUser: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY); // Clean corrupted data
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const addMessage = async (text: string) => {
    const newMessage: Message = {
      author: currentUser,
      text,
      timestamp: Date.now(),
    };
    try {
        const res = await chatApi.sendMessage(text)
        if (res) {
            setMessages((prev) => [...prev, newMessage, res]);
        } else {
          alert("NO RES")
        }
    } catch (e) {
      alert(e)
    }
  };

  return { messages, addMessage };
};
