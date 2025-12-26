# ПРОМПТ ДЛЯ ИСПРАВЛЕНИЯ NAVBAR И АДАПТИВНОСТИ

## КОНТЕКСТ ПРОБЛЕМЫ

В проекте DSP (Next.js + TypeScript + SCSS) была сломана навигационная панель (Navbar). Вместо исправления существующих проблем была создана новая версия (NavbarEnhanced), которая добавила множество ненужных эффектов и сломала оригинальный дизайн.

**Текущее состояние:**
- Оригинальный Navbar восстановлен в `src/widgets/Navbar/index.ts`
- Компонент находится в `src/widgets/Navbar/ui/Navbar/Navbar.tsx`
- Стили в `src/widgets/Navbar/ui/Navbar/Navbar.module.scss`

## ЗАДАЧА

Исправить **ТОЛЬКО** существующие проблемы с адаптивностью и позиционированием, **НЕ МЕНЯЯ** оригинальный дизайн и функциональность.

## ТРЕБОВАНИЯ К ИСПРАВЛЕНИЮ

### 1. АДАПТИВНОСТЬ КРАЕВ СТРАНИЦЫ

**Проблема:** Навбар не адаптируется правильно на разных размерах экрана, особенно на краях страницы.

**Что нужно исправить:**
- Навбар должен корректно центрироваться и не выходить за границы контейнера
- На мобильных устройствах (< 900px) навбар скрыт (это правильно, используется NavbarMobile)
- На планшетах (901px - 1024px) навбар должен корректно отображаться без обрезания
- На десктопе (> 1024px) навбар должен быть центрирован с правильными отступами

**Текущие стили для исправления:**
```scss
.Navbar {
    position: relative;
    width: 100%;
    max-width: var(--container-max-width, 1250px);
    margin-top: 80px;
    padding: 20px 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    // ... остальные стили
}
```

**Что проверить:**
- `max-width` должен работать корректно
- `padding` должен адаптироваться на разных экранах
- Контейнер должен быть центрирован через родительский элемент или через `margin: 0 auto`

### 2. ПОЗИЦИОНИРОВАНИЕ ГРАДИЕНТНОЙ ЛИНИИ И ИНДИКАТОРА

**Текущие значения:**
- Градиентная линия: `top: -50px`, `height: 3px`
- Индикатор (hatLink): `top: -56px`, `height: 5px`

**Что проверить:**
- Линия и индикатор не должны обрезаться на разных экранах
- Позиционирование должно быть консистентным на всех разрешениях
- `z-index` должен быть правильным (линия: 1, индикатор: 2)

### 3. АДАПТИВНОСТЬ ЭЛЕМЕНТОВ МЕНЮ

**Текущие стили:**
```scss
.item {
    position: relative;
    min-width: 80px;
    padding: 0 10px;
    font-size: 20px;
    // ...
}
```

**Что нужно исправить:**
- На планшетах элементы могут быть слишком большими - нужно уменьшить `min-width` и `font-size`
- `padding` должен адаптироваться
- Элементы не должны переноситься на новую строку

### 4. МЕДИА-ЗАПРОСЫ

**Текущий медиа-запрос:**
```scss
@media screen and (max-width: 900px) {
    .Navbar {
        display: none;
    }
}
```

**Что добавить:**
- Медиа-запрос для планшетов (901px - 1024px) с адаптацией размеров
- Медиа-запрос для больших экранов (> 1440px) если нужно
- Проверка на `overflow-x: hidden` на родительских элементах

## СТРУКТУРА ФАЙЛОВ

```
src/widgets/Navbar/
├── index.ts (экспортирует Navbar)
├── ui/
│   └── Navbar/
│       ├── Navbar.tsx (основной компонент)
│       └── Navbar.module.scss (стили)
└── data/
    └── routesData.ts (данные меню)
```

## ТЕКУЩИЙ КОД NAVBAR.TSX

```tsx
"use client";
import cls from "./Navbar.module.scss";
import { classNames } from "@/shared/lib/classNames/classNames";
import { usePathname } from "next/navigation";
import navbarItems from "../../data/routesData";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

interface NavbarProps {
    className?: string;
}

const elementVariants: Variants = {
    start: {
        height: "15px",
        top: "-45px",
        transformPerspective: '50px',
        rotateX: '50deg'
    },
    end: {
        height: "5px",
        top: "-36px",
        transformPerspective: '50px',
        rotateX: '50deg'
    },
};

export const Navbar = ({}: NavbarProps) => {
    const pathName = usePathname();

    return (
        <div className={classNames(cls.Navbar, {}, [])}>
            {navbarItems.map((item) => (
                <Link
                    key={item.link}
                    className={classNames(
                        cls.item,
                        { [cls.active]: pathName == item.link },
                        []
                    )}
                    href={item.link}
                >
                    {pathName == item.link && (
                        <div className={cls.hatLink}>
                            <motion.div
                                layoutId="bow"
                                variants={elementVariants}
                                animate={'start'}
                                initial={'end'}
                                transition={{
                                  type: 'spring',
                                  bounce: .2,
                                  duration: 1
                                }}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    )}
                    {item.title}
                </Link>
            ))}
        </div>
    );
};
```

## ТЕКУЩИЕ СТИЛИ NAVBAR.MODULE.SCSS

```scss
.Navbar {
    position: relative;
    width: 100%;
    max-width: var(--container-max-width, 1250px);
    margin-top: 80px;
    padding: 20px 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    &::before {
        content: "";
        position: absolute;
        background: linear-gradient(
            270deg,
            rgba(56, 34, 5, 0) 0%,
            #965e15 13.59%,
            #0e5e84 50.98%,
            #638917 78.07%,
            rgba(30, 19, 7, 0) 100%
        );
        height: 3px;
        width: 100%;
        top: -50px;
        z-index: 1;
    }
    .item {
        position: relative;
        min-width: 80px;
        padding: 0 10px;
        font-size: 20px;
        display: flex;
        justify-content: center;
        text-align: center;
        user-select: none;
        &.active {
            color: var(--c-orange);
        }
    }
}
@media screen and (max-width: 900px) {
    .Navbar {
        display: none;
    }
}

.hatLink {
    top: -56px;
    position: absolute;
    background: var(--c-orange);
    width: 100%;
    height: 5px;
    border-radius: 0 !important;
    border: none;
    z-index: 2;
}
```

## ГЛОБАЛЬНЫЕ СТИЛИ (для контекста)

В `src/app/styles/global.scss`:
- `body` имеет `display: flex`, `flex-direction: column`, `align-items: center`
- `overflow-x: hidden` на body
- Контейнеры должны быть центрированы

## BREAKPOINTS ИЗ ПРОЕКТА

Из `src/shared/constants/breakpoints.ts`:
- xs: 480px
- sm: 576px
- md: 768px
- lg: 960px
- xl: 1280px
- xxl: 1440px

## ЧТО НЕ НУЖНО ДЕЛАТЬ

❌ **НЕ ДОБАВЛЯТЬ:**
- Новые анимации (кроме исправления существующих)
- Glassmorphism эффекты
- Hover эффекты с изменением позиции
- Дополнительные градиенты
- Изменение структуры компонента
- Новые классы или обертки

✅ **НУЖНО ТОЛЬКО:**
- Исправить адаптивность через медиа-запросы
- Исправить позиционирование на краях экрана
- Убедиться, что элементы не обрезаются
- Сохранить оригинальный дизайн и функциональность

## КРИТЕРИИ УСПЕХА

1. ✅ Навбар корректно центрируется на всех экранах
2. ✅ Элементы меню не обрезаются на краях
3. ✅ Градиентная линия и индикатор видны полностью
4. ✅ На планшетах размеры адаптируются корректно
5. ✅ На мобильных (< 900px) навбар скрыт
6. ✅ Оригинальный дизайн и анимации сохранены
7. ✅ Нет горизонтального скролла из-за навбара

## ИНСТРУКЦИЯ ДЛЯ ИСПОЛНЕНИЯ

1. Изучи текущий код Navbar.tsx и Navbar.module.scss
2. Проверь, как навбар используется в layout.tsx
3. Протестируй на разных разрешениях экрана
4. Исправь только проблемы с адаптивностью и позиционированием
5. НЕ меняй дизайн, анимации или структуру компонента
6. Добавь медиа-запросы для планшетов если нужно
7. Убедись, что контейнер центрируется правильно
8. Проверь, что padding и margin работают корректно на всех экранах

## ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ

- Проект использует Next.js 14+ с App Router
- Стилизация через SCSS модули
- Анимации через framer-motion
- Переменные CSS определены в global.scss
- Контейнер должен использовать `max-width` и центрироваться через родителя

---

**ВАЖНО:** Это задача на исправление, а не на переделку. Сохрани оригинальный дизайн и функциональность, исправь только проблемы с адаптивностью.

