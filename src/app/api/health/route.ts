import { NextResponse } from 'next/server';
import { createLogger } from '@/shared/lib/logger';

const logger = createLogger('HealthAPI');

export async function GET() {
  try {
    // Проверяем наличие необходимых переменных окружения
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    if (!hasOpenAIKey) {
      return NextResponse.json(
        { 
          status: 'unhealthy', 
          reason: 'OpenAI API key not configured',
          timestamp: new Date().toISOString()
        },
        { 
          status: 503, // Service Unavailable
          headers: {
            'Cache-Control': 'no-store', // Не кешируем unhealthy статус
          },
        }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        openai: hasOpenAIKey ? 'configured' : 'missing'
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', // Кешируем на 60 секунд
      },
    });
  } catch (error) {
    logger.error('Health check error', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        reason: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 