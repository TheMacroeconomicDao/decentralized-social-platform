import { ChatProvider, ChatMessage } from './types';

export class ServerProvider implements ChatProvider {
  private readonly apiUrl = '/api/chat';
  private healthCheckCache: { isHealthy: boolean; lastCheck: number } | null = null;
  private readonly HEALTH_CHECK_INTERVAL = 60000; // 1 минута

  getName(): string {
    return 'Server API';
  }

  isAvailable(): boolean {
    // Проверяем что мы в браузере
    if (typeof window === 'undefined') {
      return false;
    }

    // Используем кэшированный результат проверки здоровья
    if (this.healthCheckCache) {
      const now = Date.now();
      if (now - this.healthCheckCache.lastCheck < this.HEALTH_CHECK_INTERVAL) {
        return this.healthCheckCache.isHealthy;
      }
    }

    // Если кэш устарел или отсутствует, считаем доступным (проверим при первом запросе)
    return true;
  }

  private async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch('/api/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 секунд таймаут
      });
      
      const isHealthy = response.ok;
      this.healthCheckCache = {
        isHealthy,
        lastCheck: Date.now()
      };
      
      return isHealthy;
    } catch (error) {
      // Если нет endpoint /api/health, пробуем простой запрос к /api/chat
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'health check', stream: false }),
          signal: AbortSignal.timeout(5000)
        });
        
        const isHealthy = response.status !== 500; // 500 = проблемы с конфигурацией
        this.healthCheckCache = {
          isHealthy,
          lastCheck: Date.now()
        };
        
        return isHealthy;
      } catch (healthError) {
        this.healthCheckCache = {
          isHealthy: false,
          lastCheck: Date.now()
        };
        return false;
      }
    }
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
        
        // Обновляем кэш здоровья при ошибках
        if (response.status === 500) {
          this.healthCheckCache = {
            isHealthy: false,
            lastCheck: Date.now()
          };
        }
        
        // Если сервер вернул готовое сообщение об ошибке, используем его
        if (errorData.author && errorData.text) {
          return errorData as ChatMessage;
        }
        
        // Пробрасываем ошибку для fallback логики
        throw new Error(`Server error: ${response.status}`);
      }

      // Успешный ответ - обновляем кэш здоровья
      this.healthCheckCache = {
        isHealthy: true,
        lastCheck: Date.now()
      };

      const data = await response.json();
      return data as ChatMessage;
    } catch (error) {
      console.error('ServerProvider error:', error);
      
      // Обновляем кэш здоровья при ошибках
      this.healthCheckCache = {
        isHealthy: false,
        lastCheck: Date.now()
      };
      
      // Пробрасываем ошибку для fallback логики в ChatProviderManager
      throw error;
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
        // Обновляем кэш здоровья при ошибках
        if (response.status === 500) {
          this.healthCheckCache = {
            isHealthy: false,
            lastCheck: Date.now()
          };
        }
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

      // Успешный ответ - обновляем кэш здоровья
      this.healthCheckCache = {
        isHealthy: true,
        lastCheck: Date.now()
      };

      return {
        author: 'Gybernaty AI',
        text: fullText,
        timestamp: Date.now(),
        avatarSrc: '/gybernaty-ai-avatar.png',
      };
    } catch (error) {
      console.error('ServerProvider streaming error:', error);
      
      // Обновляем кэш здоровья при ошибках
      this.healthCheckCache = {
        isHealthy: false,
        lastCheck: Date.now()
      };
      
      // Пробрасываем ошибку для fallback логики
      throw error;
    }
  }
} 