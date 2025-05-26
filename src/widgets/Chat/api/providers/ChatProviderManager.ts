import { ChatProvider, ChatMessage, ChatProviderType } from './types';
import { ServerProvider } from './ServerProvider';
import { PuterProvider } from './PuterProvider';

export class ChatProviderManager {
  private providers: Map<ChatProviderType, ChatProvider> = new Map();
  private currentProvider: ChatProvider | null = null;
  private fallbackOrder: ChatProviderType[] = ['server', 'puter'];
  private failedProviders: Set<ChatProviderType> = new Set();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    this.providers.set('server', new ServerProvider());
    this.providers.set('puter', new PuterProvider());
  }

  private async selectProvider(): Promise<ChatProvider> {
    // Если уже выбран работающий провайдер, используем его
    if (this.currentProvider && this.currentProvider.isAvailable() && !this.isProviderFailed(this.currentProvider)) {
      return this.currentProvider;
    }

    // Ищем первый доступный провайдер, исключая неудачные
    for (const providerType of this.fallbackOrder) {
      if (this.failedProviders.has(providerType)) {
        continue; // Пропускаем провайдеры, которые недавно падали
      }

      const provider = this.providers.get(providerType);
      if (provider && provider.isAvailable()) {
        this.currentProvider = provider;
        console.log(`Using chat provider: ${provider.getName()}`);
        return provider;
      }
    }

    // Если все провайдеры недоступны, сбрасываем список неудачных и пробуем снова
    if (this.failedProviders.size > 0) {
      console.log('All providers failed, resetting failed list and retrying...');
      this.failedProviders.clear();
      return this.selectProvider();
    }

    throw new Error('No available chat providers');
  }

  private isProviderFailed(provider: ChatProvider): boolean {
    for (const [type, p] of Array.from(this.providers.entries())) {
      if (p === provider) {
        return this.failedProviders.has(type);
      }
    }
    return false;
  }

  private markProviderAsFailed(provider: ChatProvider): void {
    for (const [type, p] of Array.from(this.providers.entries())) {
      if (p === provider) {
        this.failedProviders.add(type);
        console.log(`Marked provider ${provider.getName()} as failed`);
        break;
      }
    }
  }

  async sendMessage(message: string): Promise<ChatMessage | null> {
    let lastError: Error | null = null;

    // Пробуем все доступные провайдеры
    for (let attempt = 0; attempt < this.fallbackOrder.length; attempt++) {
      try {
        const provider = await this.selectProvider();
        const result = await provider.sendMessage(message);
        
        // Успешный ответ - сбрасываем статус неудачи для этого провайдера
        this.clearProviderFailure(provider);
        return result;
      } catch (error) {
        console.error(`ChatProviderManager attempt ${attempt + 1} failed:`, error);
        lastError = error as Error;
        
        // Помечаем текущий провайдер как неудачный
        if (this.currentProvider) {
          this.markProviderAsFailed(this.currentProvider);
          this.currentProvider = null; // Сбрасываем для выбора следующего
        }
      }
    }

    // Если все провайдеры не сработали, возвращаем fallback сообщение
    console.error('All chat providers failed:', lastError);
    return {
      author: 'Gybernaty AI',
      text: 'Извините, все AI сервисы временно недоступны. Попробуйте позже или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png',
    };
  }

  async sendMessageStream(
    message: string,
    onChunk: (chunk: string) => void
  ): Promise<ChatMessage | null> {
    let lastError: Error | null = null;

    // Пробуем все доступные провайдеры
    for (let attempt = 0; attempt < this.fallbackOrder.length; attempt++) {
      try {
        const provider = await this.selectProvider();
        
        // Проверяем поддержку streaming
        if (provider.sendMessageStream) {
          const result = await provider.sendMessageStream(message, onChunk);
          
          // Успешный ответ - сбрасываем статус неудачи для этого провайдера
          this.clearProviderFailure(provider);
          return result;
        } else {
          // Fallback к обычному сообщению
          console.warn(`Provider ${provider.getName()} doesn't support streaming, falling back to regular message`);
          const result = await provider.sendMessage(message);
          
          // Успешный ответ - сбрасываем статус неудачи для этого провайдера
          this.clearProviderFailure(provider);
          return result;
        }
      } catch (error) {
        console.error(`ChatProviderManager streaming attempt ${attempt + 1} failed:`, error);
        lastError = error as Error;
        
        // Помечаем текущий провайдер как неудачный
        if (this.currentProvider) {
          this.markProviderAsFailed(this.currentProvider);
          this.currentProvider = null; // Сбрасываем для выбора следующего
        }
      }
    }

    // Если все провайдеры не сработали, возвращаем fallback сообщение
    console.error('All chat providers failed for streaming:', lastError);
    return {
      author: 'Gybernaty AI',
      text: 'Извините, все AI сервисы временно недоступны. Попробуйте позже или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png',
    };
  }

  private clearProviderFailure(provider: ChatProvider): void {
    for (const [type, p] of Array.from(this.providers.entries())) {
      if (p === provider) {
        this.failedProviders.delete(type);
        break;
      }
    }
  }

  getCurrentProviderName(): string {
    return this.currentProvider?.getName() || 'None';
  }

  // Метод для принудительного переключения провайдера (для тестирования)
  async switchToProvider(providerType: ChatProviderType): Promise<boolean> {
    const provider = this.providers.get(providerType);
    if (provider && provider.isAvailable()) {
      this.currentProvider = provider;
      this.failedProviders.delete(providerType); // Сбрасываем статус неудачи
      console.log(`Switched to provider: ${provider.getName()}`);
      return true;
    }
    return false;
  }

  // Сброс текущего провайдера (для повторного выбора)
  resetProvider(): void {
    this.currentProvider = null;
    this.failedProviders.clear();
  }
} 