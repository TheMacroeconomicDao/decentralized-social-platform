# Стандарты кодирования

## Введение

Этот документ описывает стандарты кодирования, принятые в проекте Gybernaty DSP. Следование этим стандартам обеспечивает единообразие кода, повышает его читаемость и облегчает совместную работу.

## Общие принципы

1. **Простота и ясность** - код должен быть понятным и простым для чтения
2. **DRY (Don't Repeat Yourself)** - избегайте дублирования кода
3. **SOLID** - следуйте принципам SOLID при проектировании
4. **Чистый код** - пишите код как будто его будет читать человек, который знает где вы живете

## TypeScript

### Типизация

1. **Всегда используйте типизацию** - не используйте `any` там, где можно указать конкретный тип
2. **Интерфейсы для пропсов** - определяйте интерфейс для пропсов каждого компонента

```tsx
// Плохо
const Button = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};

// Хорошо
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  return <button className={`button button--${variant}`} onClick={onClick}>{children}</button>;
};
```

### Именование типов

1. **PascalCase для типов и интерфейсов**
2. **Описательные имена** - имя должно отражать назначение типа
3. **Суффикс `Props` для пропсов компонентов**

```typescript
// Типы и интерфейсы
interface User {
  id: string;
  name: string;
  email: string;
}

type UserRole = 'admin' | 'user' | 'guest';

// Пропсы компонентов
interface HeaderProps {
  title: string;
  isLoggedIn: boolean;
}
```

## React и Next.js

### Компоненты

1. **Функциональные компоненты** - предпочитайте функциональные компоненты классовым
2. **Деструктуризация пропсов** - используйте деструктуризацию для получения пропсов
3. **Мемоизация** - используйте `React.memo()` для компонентов, которые часто ререндерятся

```tsx
// Плохо
function UserCard(props) {
  return (
    <div>
      <h2>{props.user.name}</h2>
      <p>{props.user.email}</p>
    </div>
  );
}

// Хорошо
interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

// С мемоизацией для оптимизации
const MemoizedUserCard = React.memo(UserCard);
```

### Хуки

1. **Используйте встроенные хуки React** - `useState`, `useEffect`, `useCallback`, `useMemo` и т.д.
2. **Создавайте кастомные хуки для повторного использования логики**
3. **Правила хуков** - следуйте правилам хуков React (не вызывайте хуки в условиях и т.д.)

```tsx
// Кастомный хук
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return size;
}

// Использование хука
function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  
  return (
    <div>
      Размер окна: {width} x {height}
    </div>
  );
}
```

### Next.js

1. **App Router** - используйте новый App Router вместо Pages Router
2. **Серверные и клиентские компоненты** - правильно разделяйте компоненты на серверные и клиентские
3. **Метаданные** - используйте метаданные для SEO

```tsx
// app/page.tsx - серверный компонент
import { Metadata } from 'next';
import { ClientComponent } from './ClientComponent';

export const metadata: Metadata = {
  title: 'Главная страница | Gybernaty DSP',
  description: 'Децентрализованная социальная платформа Gybernaty',
};

export default function HomePage() {
  return (
    <main>
      <h1>Добро пожаловать</h1>
      <ClientComponent />
    </main>
  );
}
```

## CSS и SCSS

### Организация стилей

1. **Модульный подход** - каждый компонент имеет свой SCSS файл
2. **BEM-подобная методология** - используйте BEM-подобный подход для именования классов
3. **Избегайте глобальных стилей** - минимизируйте использование глобальных стилей

```scss
// Button.scss
.button {
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: 500;
  
  &--primary {
    background-color: #3498db;
    color: white;
  }
  
  &--secondary {
    background-color: #2ecc71;
    color: white;
  }
  
  &__icon {
    margin-right: 8px;
  }
}
```

### Переменные и миксины

1. **Используйте переменные** - для цветов, отступов, размеров шрифтов и т.д.
2. **Создавайте миксины для повторяющегося кода**
3. **Организуйте переменные по категориям**

```scss
// variables.scss
// Цвета
$color-primary: #3498db;
$color-secondary: #2ecc71;
$color-text: #333333;
$color-background: #f5f5f5;

// Размеры шрифтов
$font-size-small: 12px;
$font-size-medium: 16px;
$font-size-large: 24px;

// Отступы
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
```

## Форматирование кода

1. **Используйте ESLint и Prettier** для автоматического форматирования кода
2. **Отступы** - 2 пробела
3. **Кавычки** - одинарные кавычки для JavaScript/TypeScript, двойные для HTML/JSX
4. **Точка с запятой** - используйте точку с запятой в конце строк

## Импорты

1. **Группируйте импорты** - сортируйте импорты по категориям
2. **Абсолютные пути** - используйте абсолютные пути для импортов
3. **Деструктуризация при импорте** - используйте деструктуризацию при импорте

```tsx
// Импорты из внешних библиотек
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Импорты из абсолютных путей проекта
import { Button } from '@/shared/ui/Button/Button';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import { formatDate } from '@/shared/lib/formatDate';

// Импорты стилей
import './Component.scss';
```

## Комментарии

1. **Комментируйте сложную логику** - объясняйте неочевидные решения
2. **JSDoc для функций** - используйте JSDoc для документации функций
3. **TODO и FIXME** - используйте TODO для обозначения запланированных задач и FIXME для обозначения проблем

```typescript
/**
 * Вычисляет оставшееся время до указанной даты
 * @param targetDate - Целевая дата в формате ISO
 * @returns Объект с днями, часами, минутами и секундами
 */
function calculateTimeLeft(targetDate: string) {
  const difference = new Date(targetDate).getTime() - new Date().getTime();
  
  // Если дата уже прошла, возвращаем нули
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  // TODO: Добавить обработку высокосных лет
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}
```

## Производительность

1. **Мемоизация** - используйте `useMemo` и `useCallback` для оптимизации
2. **Виртуализация** - используйте виртуализацию для длинных списков
3. **Ленивая загрузка** - используйте ленивую загрузку компонентов

```tsx
// Ленивая загрузка компонента
import React, { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('@/components/HeavyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Загрузка...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

## Безопасность

1. **Валидация данных** - всегда валидируйте входные данные
2. **Защита от XSS** - не используйте `dangerouslySetInnerHTML` без очистки
3. **Зависимости** - регулярно обновляйте зависимости

## Тестирование

1. **Модульные тесты** - пишите тесты для компонентов и утилит
2. **Именование тестов** - давайте тестам понятные имена
3. **Изоляция** - тесты должны быть изолированы друг от друга

```tsx
// Button.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  test('renders with correct text', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });
  
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Доступность (A11y)

1. **Семантический HTML** - используйте правильные HTML-элементы
2. **ARIA-атрибуты** - добавляйте ARIA-атрибуты где это необходимо
3. **Фокус и навигация с клавиатуры** - обеспечьте возможность навигации с клавиатуры

```tsx
// Доступная кнопка
const AccessibleButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  ariaLabel,
}) => {
  return (
    <button
      className={`button button--${variant}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
};
``` 