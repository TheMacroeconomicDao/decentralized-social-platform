# Feature Sliced Design в проекте Gybernaty DSP

## Что такое Feature Sliced Design (FSD)?

Feature Sliced Design (FSD) - это методология проектирования архитектуры фронтенд-приложений, которая помогает организовать код в логичные, масштабируемые и поддерживаемые слои. FSD строится на трех основных принципах:

1. **Разделение на слои (Layers)** - код разделен на горизонтальные слои (app, widgets, entities, shared)
2. **Разделение на части (Slices)** - внутри слоев код разделен по бизнес-сущностям или функциональным областям
3. **Изоляция сегментов (Segments)** - внутри каждого слайса код разделен по техническим аспектам (ui, model, api, lib)

## Слои FSD в проекте Gybernaty DSP

### Слой `app`

Корневой слой приложения, содержащий входную точку приложения, глобальную конфигурацию и маршрутизацию. В проекте Gybernaty DSP этот слой представлен директорией `src/app/`, которая содержит:

- Глобальные стили (`styles/`)
- Страницы приложения с использованием Next.js App Router
- Метаданные и конфигурации страниц
- Корневой макет (`layout.tsx`)

### Слой `widgets`

Композиционный слой, который собирает компоненты из нижних слоев для создания законченных блоков интерфейса. Виджеты представляют собой крупные самодостаточные блоки страницы.

Примеры из проекта:
- `Header` - шапка сайта
- `Footer` - подвал сайта
- `Navbar` - навигационная панель
- `Banner` - баннер
- `Team` - блок с командой
- `JoinSection` - секция с призывом присоединиться к проекту

### Слой `entities`

Бизнес-сущности, которые представляют собой ключевые объекты домена приложения. Этот слой содержит компоненты, отвечающие за отображение и управление бизнес-данными.

Примеры из проекта:
- `CardMember` - карточка участника команды
- `EventCard` - карточка события
- `Roadmap` - дорожная карта
- `SocialRoadmapCard` - элемент социальной дорожной карты

### Слой `shared`

Переиспользуемая инфраструктура, не привязанная к бизнес-логике. Это самый низкоуровневый слой, который содержит базовые UI-компоненты, утилиты, хуки и другие общие элементы.

В проекте Gybernaty DSP слой `shared` разделен на:
- `ui` - базовые UI-компоненты (Button, Container, Logo и т.д.)
- `hooks` - пользовательские React-хуки
- `lib` - утилитарные функции
- `routes` - маршруты приложения
- `types` - общие типы TypeScript

## Правила импортов

FSD определяет строгие правила импортов между слоями:

1. **Односторонняя зависимость** - слои могут импортировать компоненты только из нижележащих слоев:
   - `app` может импортировать из `widgets`, `entities` и `shared`
   - `widgets` может импортировать из `entities` и `shared`
   - `entities` может импортировать только из `shared`
   - `shared` не может импортировать из других слоев

2. **Горизонтальные импорты запрещены** - компоненты одного слоя не должны импортировать компоненты того же слоя (за исключением случаев в рамках одного слайса).

## Пример структуры FSD в проекте

```
src/
├── app/                 # Слой app
│   ├── platform/        # Страница платформы
│   ├── events/          # Страница событий
│   ├── layout.tsx       # Корневой макет
│   ├── page.tsx         # Главная страница
│   └── styles/          # Глобальные стили
│
├── widgets/             # Слой widgets
│   ├── Header/          # Виджет шапки
│   ├── Footer/          # Виджет подвала
│   ├── Navbar/          # Виджет навигации
│   ├── Banner/          # Виджет баннера
│   └── Team/            # Виджет команды
│
├── entities/            # Слой entities
│   ├── CardMember/      # Сущность карточки участника
│   ├── EventCard/       # Сущность карточки события
│   └── Roadmap/         # Сущность дорожной карты
│
└── shared/              # Слой shared
    ├── ui/              # UI-компоненты
    │   ├── Button/      # Компонент кнопки
    │   ├── Container/   # Компонент контейнера
    │   └── ...
    ├── hooks/           # Пользовательские хуки
    ├── lib/             # Утилитарные функции
    ├── routes/          # Маршруты приложения
    └── types/           # Общие типы
```

## Преимущества FSD для проекта Gybernaty DSP

1. **Масштабируемость** - архитектура легко адаптируется к росту проекта
2. **Переиспользуемость** - компоненты структурированы таким образом, чтобы максимизировать их повторное использование
3. **Понятная навигация** - новые разработчики могут легко понять, где искать те или иные компоненты
4. **Изоляция** - изменения в одной части системы минимально влияют на другие
5. **Слабая связанность** - компоненты слабо связаны между собой, что делает систему более гибкой

## Рекомендации по работе с FSD

1. **Правильное размещение компонентов** - всегда оценивайте, к какому слою относится ваш новый компонент
2. **Следуйте правилам импортов** - избегайте импортов, нарушающих иерархию слоев
3. **Не нарушайте абстракцию** - каждый слой имеет свой уровень абстракции, старайтесь его придерживаться
4. **Изолируйте изменения** - внесение изменений должно затрагивать минимальное количество файлов
5. **Думайте о переиспользовании** - оценивайте потенциал переиспользования компонента при его создании 