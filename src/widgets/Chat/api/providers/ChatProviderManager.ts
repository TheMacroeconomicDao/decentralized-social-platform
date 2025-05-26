import { ChatProvider, ChatMessage, ChatProviderType } from './types';
import { ServerProvider } from './ServerProvider';
import { PuterProvider } from './PuterProvider';

export class ChatProviderManager {
  private providers: Map<ChatProviderType, ChatProvider> = new Map();
  private currentProvider: ChatProvider | null = null;
  private fallbackOrder: ChatProviderType[] = ['server', 'puter'];

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    this.providers.set('server', new ServerProvider());
    this.providers.set('puter', new PuterProvider());
  }

  private async selectProvider(): Promise<ChatProvider> {
    // Если уже выбран работающий провайдер, используем его
    if (this.currentProvider && this.currentProvider.isAvailable()) {
      return this.currentProvider;
    }

    // Ищем первый доступный провайдер
    for (const providerType of this.fallbackOrder) {
      const provider = this.providers.get(providerType);
      if (provider && provider.isAvailable()) {
        this.currentProvider = provider;
        console.log(`Using chat provider: ${provider.getName()}`);
        return provider;
      }
    }

    throw new Error('No available chat providers');
  }

  async sendMessage(message: string): Promise<ChatMessage | null> {
    try {
      const provider = await this.selectProvider();
      return await provider.sendMessage(message);
    } catch (error) {
      console.error('ChatProviderManager error:', error);
      
      // Fallback сообщение если все провайдеры недоступны
      return {
        author: 'Gybernaty AI',
        text: 'Извините, все AI сервисы временно недоступны. Попробуйте позже или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
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
      const provider = await this.selectProvider();
      
      // Проверяем поддержку streaming
      if (provider.sendMessageStream) {
        return await provider.sendMessageStream(message, onChunk);
      } else {
        // Fallback к обычному сообщению
        console.warn(`Provider ${provider.getName()} doesn't support streaming, falling back to regular message`);
        return await provider.sendMessage(message);
      }
    } catch (error) {
      console.error('ChatProviderManager streaming error:', error);
      
      return {
        author: 'Gybernaty AI',
        text: 'Извините, все AI сервисы временно недоступны. Попробуйте позже или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
        timestamp: Date.now(),
        avatarSrc: '/gybernaty-ai-avatar.png',
      };
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
      console.log(`Switched to provider: ${provider.getName()}`);
      return true;
    }
    return false;
  }

  // Сброс текущего провайдера (для повторного выбора)
  resetProvider(): void {
    this.currentProvider = null;
  }
} 