# Каталог компонентов

## UI-компоненты из shared/ui

### Button

**Описание:** Универсальная кнопка для действий пользователя.

**Пропсы:**
- `children`: React.ReactNode - Содержимое кнопки
- `onClick`: () => void - Обработчик клика
- `variant`: 'primary' | 'secondary' | 'outlined' - Вариант отображения
- `disabled`: boolean - Флаг отключения кнопки

**Пример использования:**
```tsx
<Button variant="primary" onClick={handleClick}>
  Нажми меня
</Button>
```

### Section

**Описание:** Обертка для секций страницы с заголовком и содержимым.

**Пример использования:**
```tsx
<Section title="Наша команда">
  <TeamContent />
</Section>
```

### Container

**Описание:** Контейнер для ограничения ширины контента.

**Пример использования:**
```tsx
<Container>
  <Content />
</Container>
```

### Logo

**Описание:** Логотип проекта.

**Пример использования:**
```tsx
<Logo />
```

### Substrate

**Описание:** Компонент для отображения информационных блоков с заголовком, подзаголовком и текстом.

**Пример использования:**
```tsx
<Substrate 
  title="Добро пожаловать"
  subtitle="О нашем проекте"
  text="Подробное описание проекта..."
/>
```

### CountdownTimer

**Описание:** Таймер обратного отсчета для событий.

**Пропсы:**
- `targetDate`: string - Дата окончания отсчета
- `onComplete`: () => void - Функция, вызываемая по окончании отсчета

**Пример использования:**
```tsx
<CountdownTimer targetDate="2023-12-31T23:59:59" onComplete={handleComplete} />
```

### SelectOption

**Описание:** Кастомный селект с возможностью выбора из списка опций.

**Пример использования:**
```tsx
<SelectOption 
  options={['Option 1', 'Option 2', 'Option 3']}
  onChange={handleChange}
  defaultValue="Option 1"
/>
```

## Entity-компоненты

### CardMember

**Описание:** Карточка участника команды.

**Пример использования:**
```tsx
<CardMember 
  name="Иван Иванов"
  role="Разработчик"
  avatar="/images/team/ivan.jpg"
  socialLinks={{
    github: "https://github.com/ivan",
    telegram: "https://t.me/ivan"
  }}
/>
```

### EventCard

**Описание:** Карточка события.

**Пример использования:**
```tsx
<EventCard 
  title="Конференция по блокчейну"
  date="2023-09-15"
  description="Описание события..."
  image="/images/events/conference.jpg"
/>
```

### Roadmap

**Описание:** Дорожная карта проекта с этапами развития.

**Пример использования:**
```tsx
<Roadmap items={roadmapItems} />
```

## Widget-компоненты

### Banner

**Описание:** Баннер для привлечения внимания пользователей.

**Пример использования:**
```tsx
<Banner 
  title="Присоединяйтесь к нам"
  buttonText="Начать"
  onButtonClick={handleJoin}
/>
```

### Header

**Описание:** Шапка сайта с логотипом и навигацией.

**Пример использования:**
```tsx
<Header />
```

### Footer

**Описание:** Подвал сайта с контактной информацией и ссылками.

**Пример использования:**
```tsx
<Footer />
```

### Navbar

**Описание:** Навигационная панель с ссылками на страницы сайта.

**Пример использования:**
```tsx
<Navbar />
```

### Team

**Описание:** Секция с информацией о команде проекта.

**Пример использования:**
```tsx
<Team />
```

### JoinSection

**Описание:** Секция с призывом присоединиться к проекту.

**Пример использования:**
```tsx
<JoinSection />
```

### EventsSection

**Описание:** Секция с событиями и мероприятиями.

**Пример использования:**
```tsx
<EventsSection />
```

### Products

**Описание:** Секция с продуктами или проектами.

**Пример использования:**
```tsx
<Products />
```

### SocialPlatformRoadmap

**Описание:** Дорожная карта социальной платформы.

**Пример использования:**
```tsx
<SocialPlatformRoadmap />
```

### TechnicalRoadmapSection

**Описание:** Секция с технической дорожной картой.

**Пример использования:**
```tsx
<TechnicalRoadmapSection />
```

### Slider

**Описание:** Слайдер для отображения изображений или контента.

**Пропсы:**
- `path`: string - Путь к изображению для десктопной версии
- `mobilePath`: string - Путь к изображению для мобильной версии
- `title`: string - Заголовок слайда

**Пример использования:**
```tsx
<Slider 
  path="/images/slides/main-slide.jpg"
  mobilePath="/images/slides/main-mobile-slide.jpg"
  title="Community of Progressive Enthusiasts"
/>
```

### PartnerSection

**Описание:** Секция с информацией для партнеров.

**Пример использования:**
```tsx
<PartnerSection>
  Информация для партнеров и инвесторов...
</PartnerSection>
``` 