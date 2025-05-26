'use client'

// Declare Puter global interface for TypeScript
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (message: string, options?: { model: string; stream?: boolean }) => Promise<any>;
      };
    };
  }
}

export interface ClaudeResponse {
  author: string;
  text: string;
  timestamp: number;
  avatarSrc?: string;
}

// Constants for Puter.js
const PUTER_SCRIPT_ID = 'puter-script';

// System prompt for Gybernaty AI
const GYBERNATY_SYSTEM_PROMPT = `Ты - Gybernaty AI, интеллектуальный помощник прогрессивного сообщества исследователей и разработчиков Gybernaty.

ТВОЯ РОЛЬ И ЛИЧНОСТЬ:
- Ты официальный AI помощник Gybernaty Community
- Ты эксперт в области Web3, blockchain, distributed computing, AI и децентрализованных технологий
- Ты помогаешь участникам сообщества с вопросами по проектам, технологиям и философии Gybernaty
- Ты НЕ Claude, ты не упоминаешь Anthropic или других AI провайдеров

О GYBERNATY COMMUNITY:
Gybernaty - это прогрессивное Rocket-Science сообщество исследователей и разработчиков, которое занимается исследованиями в области:
- Web3 и blockchain технологии
- Cross-chain интеграция
- Distributed ledger technology (DLT)
- Highload системы и distributed computing
- Distributed storage networks и file systems
- Искусственный интеллект

ФИЛОСОФИЯ И ЦЕННОСТИ:
1. **Openness (Открытость)** - открытый исходный код, прозрачность, доступность знаний
2. **Collaboration (Сотрудничество)** - коллективный интеллект, децентрализованная коллаборация
3. **Innovation (Инновации)** - прорывные технологии на стыке дисциплин
4. **Community (Сообщество)** - социальный капитал, взаимная поддержка, обучение

ОСНОВНЫЕ ПРОЕКТЫ GYBERNATY:
1. **DSP (Decentralized Social Platform)** - децентрализованная социальная платформа
2. **LQD (AI-Assets-Manager)** - AI-менеджер активов для управления криптопортфелем
3. **SAPP** - безопасный децентрализованный мессенджер
4. **PowerSwapMeta** - метавселенная с реальными экономическими активами
5. **Contact** - Telegram mini-app для превращения Telegram в полноценную соцсеть

МИССИЯ:
Реализация масштабной open source экосистемы - мощной и удобной среды, которая способствует открытому образованию, эффективному обмену опытом и организации прогрессивных исследований.

ВИДЕНИЕ:
Стать глобальным хабом для продвинутых энтузиастов и разработчиков, революционизирующим enterprise разработку через децентрализованную коллаборацию.

ТОКЕНОМИКА:
- Community Token (GBR): 0xa970cae9fa1d7cca913b7c19df45bf33d55384a9
- Reward mechanisms для участников сообщества
- DAO governance структура

КАК ОТВЕЧАТЬ:
- Всегда оставайся в роли Gybernaty AI
- Отвечай на том же языке, на котором был задан вопрос, если не указано иное
- Используй знания о проектах и философии Gybernaty
- Поощряй участие в сообществе и open source разработке
- При вопросах о технологиях связывай их с проектами Gybernaty
- Если не знаешь что-то конкретное - предложи обратиться к сообществу в Telegram

ПОЛЕЗНЫЕ ССЫЛКИ:
- Документация: https://github.com/GyberExperiment/live-papers/wiki
- Telegram: https://t.me/HeadsHub
- GitHub: https://github.com/GyberExperiment

Ты здесь, чтобы помочь участникам сообщества Gybernaty развивать инновационные проекты и продвигать децентрализованное будущее!`;

import { CHAT_MODE, OPENAI_API_KEY, OPENAI_MODEL } from './chatConfig';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Load Puter.js script if not already loaded
const loadPuterScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.puter) {
      resolve();
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.getElementById(PUTER_SCRIPT_ID);
    if (existingScript) {
      existingScript.onload = () => resolve();
      existingScript.onerror = () => reject(new Error('Failed to load Puter.js'));
      return;
    }

    // Create and append script
    const script = document.createElement('script');
    script.id = PUTER_SCRIPT_ID;
    script.src = 'https://js.puter.com/v2/';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Puter.js'));
    document.head.appendChild(script);
  });
};

// Initialize Puter
const initializePuter = async (): Promise<boolean> => {
  try {
    await loadPuterScript();
    
    if (!window.puter) {
      throw new Error('Puter.js not available after loading');
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize Puter:', error);
    throw error;
  }
};

const sendMessageOpenAI = async (message: string): Promise<ClaudeResponse | null> => {
  try {
    if (!OPENAI_API_KEY) throw new Error('OpenAI API key is not set');
    const systemPrompt = GYBERNATY_SYSTEM_PROMPT;
    const res = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      }),
    });
    if (!res.ok) throw new Error('OpenAI API error');
    const data = await res.json();
    const responseText = data.choices?.[0]?.message?.content || 'No response';
    return {
      author: 'Gybernaty AI',
      text: responseText,
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png',
    };
  } catch (error) {
    console.error('OpenAI error:', error);
    return {
      author: 'Gybernaty AI',
      text: 'Извините, произошла ошибка OpenAI. Попробуйте еще раз или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png',
    };
  }
};

const sendMessageStreamOpenAI = async (
  message: string,
  onChunk: (chunk: string) => void
): Promise<ClaudeResponse | null> => {
  try {
    if (!OPENAI_API_KEY) throw new Error('OpenAI API key is not set');
    const systemPrompt = GYBERNATY_SYSTEM_PROMPT;
    const res = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      }),
    });
    if (!res.body) throw new Error('No response body from OpenAI');
    const reader = res.body.getReader();
    let fullText = '';
    let done = false;
    const decoder = new TextDecoder('utf-8');
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        // OpenAI stream returns lines starting with 'data: '
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            const json = line.replace('data: ', '').trim();
            if (json === '[DONE]') continue;
            try {
              const parsed = JSON.parse(json);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullText += delta;
                onChunk(delta);
              }
            } catch (e) { /* ignore */ }
          }
        }
      }
    }
    return {
      author: 'Gybernaty AI',
      text: fullText,
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png',
    };
  } catch (error) {
    console.error('OpenAI stream error:', error);
    return {
      author: 'Gybernaty AI',
      text: 'Извините, произошла ошибка OpenAI (stream). Попробуйте еще раз или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png',
    };
  }
};

const sendMessage = async (message: string): Promise<ClaudeResponse | null> => {
  if (CHAT_MODE === 'openai') {
    return sendMessageOpenAI(message);
  }
  return sendMessagePuter(message);
};

const sendMessageStream = async (
  message: string,
  onChunk: (chunk: string) => void
): Promise<ClaudeResponse | null> => {
  if (CHAT_MODE === 'openai') {
    return sendMessageStreamOpenAI(message, onChunk);
  }
  return sendMessageStreamPuter(message, onChunk);
};

// Старые функции Puter (переименованы для читаемости)
const sendMessagePuter = async (message: string): Promise<ClaudeResponse | null> => {
  try {
    await initializePuter();
    const fullMessage = `${GYBERNATY_SYSTEM_PROMPT}\n\nПользователь: ${message}`;
    const response = await window.puter.ai.chat(fullMessage, { model: 'claude-3-7-sonnet' });
    const responseText = response?.message?.content?.[0]?.text || response?.text || 'No response';
    return {
      author: 'Gybernaty AI',
      text: responseText,
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png'
    };
  } catch (error) {
    console.error('Error sending message to Claude:', error);
    return {
      author: 'Gybernaty AI',
      text: 'Извините, произошла ошибка. Попробуйте еще раз или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png'
    };
  }
};

const sendMessageStreamPuter = async (
  message: string,
  onChunk: (chunk: string) => void
): Promise<ClaudeResponse | null> => {
  try {
    await initializePuter();
    const fullMessage = `${GYBERNATY_SYSTEM_PROMPT}\n\nПользователь: ${message}`;
    const response = await window.puter.ai.chat(fullMessage, { model: 'claude-3-7-sonnet', stream: true });
    let fullText = '';
    for await (const part of response) {
      const chunkText = part?.text || '';
      if (chunkText) {
        fullText += chunkText;
        onChunk(chunkText);
      }
    }
    return {
      author: 'Gybernaty AI',
      text: fullText,
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png'
    };
  } catch (error) {
    console.error('Error in streaming:', error);
    return {
      author: 'Gybernaty AI',
      text: 'Извините, произошла ошибка во время потоковой передачи. Попробуйте еще раз или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png'
    };
  }
};

export default {
  sendMessage,
  sendMessageStream,
};