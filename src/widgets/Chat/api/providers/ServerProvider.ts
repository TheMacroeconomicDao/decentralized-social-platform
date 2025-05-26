import { ChatProvider, ChatMessage } from './types';

export class ServerProvider implements ChatProvider {
  private readonly apiUrl = '/api/chat';

  getName(): string {
    return 'Server API';
  }

  isAvailable(): boolean {
    // Проверяем что мы в браузере и API доступен
    return typeof window !== 'undefined';
  }

  async sendMessage(message: string): Promise<ChatMessage | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, stream: false }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server API error:', response.status, errorData);
        
        // Если сервер вернул готовое сообщение об ошибке, используем его
        if (errorData.author && errorData.text) {
          return errorData as ChatMessage;
        }
        
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      return data as ChatMessage;
    } catch (error) {
      console.error('ServerProvider error:', error);
      return {
        author: 'Gybernaty AI',
        text: 'Извините, произошла ошибка при обращении к серверу. Попробуйте еще раз или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
        timestamp: Date.now(),
        avatarSrc: '/gybernaty-ai-avatar.png',
      };
    }
  }

  async sendMessageStream(
    message: string, 
    onChunk: (chunk: string) => void
  ): Promise<ChatMessage | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, stream: true }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body for streaming');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          
          // Обрабатываем OpenAI streaming формат
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
              } catch (e) {
                // Игнорируем ошибки парсинга отдельных чанков
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        author: 'Gybernaty AI',
        text: fullText,
        timestamp: Date.now(),
        avatarSrc: '/gybernaty-ai-avatar.png',
      };
    } catch (error) {
      console.error('ServerProvider streaming error:', error);
      return {
        author: 'Gybernaty AI',
        text: 'Извините, произошла ошибка при потоковой передаче. Попробуйте еще раз или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
        timestamp: Date.now(),
        avatarSrc: '/gybernaty-ai-avatar.png',
      };
    }
  }
} 