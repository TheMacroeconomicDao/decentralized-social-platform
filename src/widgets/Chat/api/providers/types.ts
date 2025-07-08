export interface ChatMessage {
  author: string;
  text: string;
  timestamp: number;
  avatarSrc?: string;
}

export interface ChatProvider {
  sendMessage(message: string): Promise<ChatMessage | null>;
  sendMessageStream?(message: string, onChunk: (chunk: string) => void): Promise<ChatMessage | null>;
  isAvailable(): boolean;
  getName(): string;
}

export type ChatProviderType = 'server' | 'puter' | 'fallback'; 