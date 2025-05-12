# API документация проекта Gybernaty DSP

## Введение

Данная документация описывает API и интеграционные возможности проекта Gybernaty DSP. На текущем этапе разработки проект в основном фокусируется на клиентской части и не имеет полноценного собственного API, но имеет интеграции с внешними сервисами.

## Маршруты Next.js API

### Структура API маршрутов

Next.js API маршруты располагаются в директории `src/app/api/`. Каждый файл представляет собой отдельный API эндпоинт.

```
src/app/api/
├── route.ts        # Основной API-маршрут (GET, POST)
```

### Пример API-маршрута

```typescript
// src/app/api/example/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Hello from API!' 
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ 
    received: body,
    status: 'success' 
  });
}
```

## Интеграции с внешними API

Проект может интегрироваться с различными внешними API для расширения функциональности:

### Потенциальные интеграции:

1. **Blockchain API**
   - Взаимодействие со смарт-контрактами
   - Верификация транзакций
   - Управление токенами

2. **IPFS**
   - Хранение файлов
   - Распределенное хранение контента

3. **OAuth провайдеры**
   - Авторизация через Google, GitHub и другие платформы

## Формат данных

### События (Events)

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO format
  location?: string;
  imageUrl?: string;
}
```

### Участники команды (Team Members)

```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    telegram?: string;
    linkedIn?: string;
  };
}
```

### Roadmap элементы (Roadmap Items)

```typescript
interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  phase: string;
  completed: boolean;
  date?: string; // ISO format or quarter (e.g. "Q1 2023")
}
```

## Обработка ошибок

API возвращает стандартные HTTP-коды состояния:

- `200 OK` - Запрос выполнен успешно
- `400 Bad Request` - Некорректные данные запроса
- `401 Unauthorized` - Требуется аутентификация
- `403 Forbidden` - Нет прав доступа
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

## Аутентификация

На текущем этапе проект не имеет встроенной системы аутентификации, но планируется реализация через:

1. JWT-токены
2. OAuth
3. Web3 авторизацию (подпись с помощью криптокошелька)

## Примеры интеграции

### Пример запроса данных с использованием fetch

```typescript
// Пример получения данных из API
async function fetchEvents() {
  try {
    const response = await fetch('/api/events');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}
```

### Пример отправки данных

```typescript
// Пример отправки данных в API
async function createEvent(eventData) {
  try {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}
``` 