import { NextResponse } from 'next/server';

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
        { status: 503 } // Service Unavailable
      );
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        openai: hasOpenAIKey ? 'configured' : 'missing'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
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