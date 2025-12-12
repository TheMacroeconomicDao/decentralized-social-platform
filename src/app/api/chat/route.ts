import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/shared/lib/logger';

const logger = createLogger('ChatAPI');
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Серверная переменная без NEXT_PUBLIC_
const OPENAI_MODEL = 'gpt-4';

// Кеш для ответов (in-memory cache)
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

/**
 * Генерация ключа кеша на основе сообщения
 */
function generateCacheKey(message: string): string {
  return `chat:${message.trim().toLowerCase().slice(0, 100)}`;
}

/**
 * Проверка и получение из кеша
 */
function getCachedResponse(key: string): any | null {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  if (cached) {
    responseCache.delete(key); // Удаляем устаревший кеш
  }
  return null;
}

/**
 * Сохранение в кеш
 */
function setCachedResponse(key: string, data: any): void {
  // Ограничиваем размер кеша (максимум 100 записей)
  if (responseCache.size >= 100) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey !== undefined) {
      responseCache.delete(firstKey);
    }
  }
  responseCache.set(key, { data, timestamp: Date.now() });
}

const GYBERNATY_SYSTEM_PROMPT = `Ты — Gybernaty AI, официальный ИИ-ассистент сообщества Gybernaty. Твоя задача — помогать участникам сообщества, отвечать на вопросы о проектах и философии Gybernaty, а также поощрять участие в open source разработке.

ОСНОВНАЯ ИНФОРМАЦИЯ О GYBERNATY:

ФИЛОСОФИЯ GYBERNATY основана на 4 столпах:
1. **Science (Наука)** - фундаментальные исследования, peer review
2. **Technology (Технологии)** - практическое применение научных открытий
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

interface ChatRequest {
  message: string;
  stream?: boolean;
}

interface ChatResponse {
  author: string;
  text: string;
  timestamp: number;
  avatarSrc?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Проверяем наличие API ключа
    if (!OPENAI_API_KEY) {
      logger.error('OpenAI API key is not configured');
      return NextResponse.json(
        { 
          error: 'OpenAI API key is not configured',
          author: 'Gybernaty AI',
          text: 'Извините, сервис временно недоступен. Попробуйте позже или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
          timestamp: Date.now(),
          avatarSrc: '/gybernaty-ai-avatar.png',
        },
        { status: 500 }
      );
    }

    // Получаем и валидируем данные запроса
    const body: ChatRequest = await request.json();
    const { message, stream = false } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Ограничиваем длину сообщения
    if (message.length > 4000) {
      return NextResponse.json(
        { error: 'Message is too long. Maximum 4000 characters allowed.' },
        { status: 400 }
      );
    }

    // Проверяем кеш (только для не-streaming запросов)
    if (!stream) {
      const cacheKey = generateCacheKey(message);
      const cachedResponse = getCachedResponse(cacheKey);
      if (cachedResponse) {
        logger.log('Returning cached response', { data: { cacheKey } });
        return NextResponse.json(cachedResponse, {
          headers: {
            'X-Cache': 'HIT',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        });
      }
    }

    // Подготавливаем запрос к OpenAI
    const openaiRequest = {
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: GYBERNATY_SYSTEM_PROMPT },
        { role: 'user', content: message.trim() },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      stream: stream,
    };

    // Отправляем запрос к OpenAI
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(openaiRequest),
    });

    if (!response.ok) {
      const errorData = await response.text();
      logger.error('OpenAI API error', new Error(`Status: ${response.status}`), { 
        data: { 
          status: response.status, 
          errorData 
        }
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to get response from OpenAI',
          author: 'Gybernaty AI',
          text: 'Извините, произошла ошибка при обращении к AI. Попробуйте еще раз или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
          timestamp: Date.now(),
          avatarSrc: '/gybernaty-ai-avatar.png',
        },
        { status: response.status }
      );
    }

    if (stream) {
      // Для streaming ответов - проксируем поток
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    } else {
      // Для обычных ответов
      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content || 'No response received';
      
      const chatResponse: ChatResponse = {
        author: 'Gybernaty AI',
        text: responseText,
        timestamp: Date.now(),
        avatarSrc: '/gybernaty-ai-avatar.png',
      };

      // Сохраняем в кеш
      const cacheKey = generateCacheKey(message);
      setCachedResponse(cacheKey, chatResponse);

      return NextResponse.json(chatResponse, {
        headers: {
          'X-Cache': 'MISS',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }
  } catch (error) {
    logger.error('Chat API error', error);
    
    const errorResponse: ChatResponse = {
      author: 'Gybernaty AI',
      text: 'Извините, произошла внутренняя ошибка сервера. Попробуйте еще раз или обратитесь к сообществу в Telegram: https://t.me/HeadsHub',
      timestamp: Date.now(),
      avatarSrc: '/gybernaty-ai-avatar.png',
    };

    return NextResponse.json(
      { error: 'Internal server error', ...errorResponse },
      { status: 500 }
    );
  }
} 