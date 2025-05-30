# Руководство по внесению вклада в проект

## Введение

Мы рады, что вы заинтересованы во внесении вклада в проект Gybernaty DSP! Этот документ содержит руководство по процессу внесения изменений и улучшений в наш проект.

## Кодекс поведения

При участии в этом проекте, пожалуйста, соблюдайте основные правила вежливости и уважения к другим участникам. Наша цель - создать открытое и гостеприимное сообщество.

## Как внести вклад

### 1. Настройка локального окружения

1. **Форк репозитория**:
   - Посетите [репозиторий на GitHub](https://github.com/TheMacroeconomicDao/decentralized-social-platform)
   - Нажмите кнопку "Fork" в правом верхнем углу

2. **Клонируйте ваш форк**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/decentralized-social-platform.git
   cd decentralized-social-platform
   ```

3. **Добавьте оригинальный репозиторий как удаленный источник**:
   ```bash
   git remote add upstream https://github.com/TheMacroeconomicDao/decentralized-social-platform.git
   ```

4. **Установите зависимости**:
   ```bash
   npm install
   # или
   yarn install
   ```

### 2. Создание новой ветки

Для каждой новой функции или исправления создавайте отдельную ветку:

```bash
git checkout -b feature/your-feature-name
# или
git checkout -b fix/issue-you-are-fixing
```

### 3. Внесение изменений

1. **Следуйте стилю кода проекта**:
   - Используйте TypeScript
   - Следуйте архитектуре Feature Sliced Design
   - Следуйте соглашениям по именованию

2. **Тестируйте ваши изменения**:
   - Убедитесь, что ваш код компилируется без ошибок
   - Проверьте функциональность в браузере

3. **Коммитьте изменения с осмысленными сообщениями**:
   ```bash
   git add .
   git commit -m "feat: добавлена новая функциональность XYZ"
   ```
   
   Используйте префиксы в сообщениях коммитов:
   - `feat:` для новых функций
   - `fix:` для исправления ошибок
   - `docs:` для изменений в документации
   - `style:` для изменений форматирования кода
   - `refactor:` для рефакторинга кода
   - `test:` для добавления или изменения тестов
   - `chore:` для обновления зависимостей или настроек

### 4. Отправка изменений

1. **Синхронизируйтесь с оригинальным репозиторием**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Отправьте ваши изменения в ваш форк**:
   ```bash
   git push origin feature/your-feature-name
   ```

### 5. Создание Pull Request

1. **Перейдите в ваш форк на GitHub**
2. **Нажмите кнопку "Compare & pull request"**
3. **Заполните описание PR**:
   - Укажите, что именно вы изменили
   - Укажите связанные задачи или issues
   - Добавьте скриншоты, если это уместно

4. **Отправьте PR и ждите отзывов**

## Стандарты кода

### Организация кода

Проект следует архитектуре Feature Sliced Design. Подробнее в [документации по архитектуре](../architecture/feature-sliced-design.md).

### Стилизация компонентов

Мы используем SCSS для стилизации компонентов:

```scss
// Пример файла стилей Button.scss
.button {
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &--primary {
    background-color: #3498db;
    color: white;
  }
  
  &--secondary {
    background-color: #2ecc71;
    color: white;
  }
  
  &--outlined {
    background-color: transparent;
    border: 1px solid #3498db;
    color: #3498db;
  }
}
```

### TypeScript

Используйте TypeScript для всего кода. Определяйте интерфейсы для пропсов компонентов:

```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outlined';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  // Реализация компонента
};
```

## Процесс ревью

1. Мейнтейнеры проекта рассмотрят ваш PR в ближайшее время
2. Будьте готовы внести дополнительные изменения по запросу
3. После одобрения, ваши изменения будут слиты с основной веткой

## Отчеты об ошибках

Если вы обнаружили ошибку, создайте issue в GitHub с подробным описанием:

1. Шаги для воспроизведения ошибки
2. Ожидаемое поведение
3. Фактическое поведение
4. Скриншоты или видео (если возможно)
5. Информация о среде (браузер, ОС и т.д.)

## Запрос новых функций

Если у вас есть идея для новой функции:

1. Сначала убедитесь, что подобная функция еще не предложена в issues
2. Создайте новый issue с описанием функции
3. Объясните, какую проблему решает эта функция
4. Если возможно, предложите реализацию

## Вопросы и обсуждения

Для вопросов и обсуждений используйте GitHub Discussions или свяжитесь с нами через официальные каналы Gybernaty Community.

Спасибо за ваш вклад в развитие проекта Gybernaty DSP! 