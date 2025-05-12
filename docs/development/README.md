# Руководство по разработке

## Настройка окружения

### Требования

- Node.js 16.x или выше
- npm, yarn или pnpm
- Git

### Запуск проекта локально

1. Клонировать репозиторий:
```bash
git clone https://github.com/TheMacroeconomicDao/decentralized-social-platform.git
cd decentralized-social-platform
```

2. Установить зависимости:
```bash
npm install
# или
yarn install
# или
pnpm install
```

3. Запустить проект в режиме разработки:
```bash
npm run dev
# или
yarn dev
# или
pnpm dev
```

4. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Структура проекта

```
/
├── .github/         # Конфигурация GitHub Actions
├── docs/            # Документация проекта
├── public/          # Статические файлы
├── src/             # Исходный код
│   ├── app/         # Страницы Next.js App Router
│   ├── entities/    # Бизнес-сущности
│   ├── shared/      # Переиспользуемые компоненты и утилиты
│   └── widgets/     # Составные компоненты
├── .dockerignore    # Исключения для Docker
├── .eslintrc.json   # Конфигурация ESLint
├── .gitignore       # Исключения для Git
├── Dockerfile       # Конфигурация Docker
├── docker-compose.yml # Конфигурация Docker Compose
├── next.config.js   # Конфигурация Next.js
├── package.json     # Зависимости и скрипты
└── tsconfig.json    # Конфигурация TypeScript
```

## Соглашения кода

### Именование файлов

- Компоненты: `PascalCase.tsx`
- Утилиты: `camelCase.ts`
- Типы: `entityName.types.ts`
- Стили: `componentName.scss`

### Импорты

Используйте абсолютные импорты с алиасами:

```tsx
// Правильно
import { Button } from '@/shared/ui/Button/Button'

// Неправильно
import { Button } from '../../../shared/ui/Button/Button'
```

### Стиль кода

Проект использует ESLint и TypeScript для поддержания качества кода. Убедитесь, что ваш код проходит проверку:

```bash
npm run lint
```

## Рабочий процесс

1. Создайте новую ветку от `main` для своей задачи:
```bash
git checkout -b feature/your-feature-name
```

2. Разрабатывайте и коммитьте изменения
3. Убедитесь, что код проходит линтинг
4. Отправьте ветку в репозиторий и создайте Pull Request
5. Дождитесь ревью и мерджа в основную ветку

## Создание новых компонентов

При создании нового компонента следуйте структуре:

```
ComponentName/
├── index.ts               # Реэкспорт компонента
├── ComponentName.tsx      # Код компонента
└── ComponentName.scss     # Стили компонента
```

Пример создания нового компонента:

```tsx
// Button/Button.tsx
import React from 'react'
import './Button.scss'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outlined'
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={`button button--${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
``` 