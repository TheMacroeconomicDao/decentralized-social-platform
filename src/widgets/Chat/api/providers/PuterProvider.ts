import { ChatProvider, ChatMessage } from './types';

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

const PUTER_SCRIPT_ID = 'puter-script';

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

ПОЛЕЗНЫЕ ССЫЛКИ:
- Документация: https://themacroeconomicdao.github.io/GYBER_EXPERIMENT_DOCS/
- Telegram: https://t.me/HeadsHub
- GitHub: https://github.com/TheMacroeconomicDao

Ты здесь, чтобы помочь участникам сообщества Gybernaty развивать инновационные проекты и продвигать децентрализованное будущее!`;

export class PuterProvider implements ChatProvider {
  private isInitialized = false;

  getName(): string {
    return 'Puter AI';
  }

  isAvailable(): boolean {
    return typeof window !== 'undefined';
  }

  private async loadPuterScript(): Promise<void> {
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
  }

  private async initializePuter(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loadPuterScript();
      
      if (!window.puter) {
        throw new Error('Puter.js not available after loading');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Puter:', error);
      throw error;
    }
  }

  async sendMessage(message: string): Promise<ChatMessage | null> {
    try {
      await this.initializePuter();
      
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
      console.error('PuterProvider error:', error);
      return {
        author: 'Gybernaty AI',
        text: 'Извините, произошла ошибка. Попробуйте еще раз или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
        timestamp: Date.now(),
        avatarSrc: '/gybernaty-ai-avatar.png'
      };
    }
  }

  async sendMessageStream(
    message: string,
    onChunk: (chunk: string) => void
  ): Promise<ChatMessage | null> {
    try {
      await this.initializePuter();
      
      const fullMessage = `${GYBERNATY_SYSTEM_PROMPT}\n\nПользователь: ${message}`;
      const response = await window.puter.ai.chat(fullMessage, { 
        model: 'claude-3-7-sonnet', 
        stream: true 
      });
      
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
      console.error('PuterProvider streaming error:', error);
      return {
        author: 'Gybernaty AI',
        text: 'Извините, произошла ошибка во время потоковой передачи. Попробуйте еще раз или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
        timestamp: Date.now(),
        avatarSrc: '/gybernaty-ai-avatar.png'
      };
    }
  }
} 