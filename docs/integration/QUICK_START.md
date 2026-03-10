# DSP × IP Assignment Integration — Quick Start

**Для:** Разработчиков DSP Client  
**Дата:** 2026-03-08  
**Время на чтение:** 5 минут

---

## 🎯 Что нужно сделать

Интегрировать механизм принятия **DUNA-CLA** (Contributor License Agreement) в текущий флоу регистрации пользователя DSP.

**Зачем:** Для автоматической передачи авторских прав от участников сообщества организации Gybernaty DUNA.

---

## 📁 Какие файлы затронуты

### Новые файлы (создать)

```
src/
├── shared/
│   ├── types/
│   │   └── unit-profile.ts (ОБНОВИТЬ)
│   └── hooks/
│       └── useDUNACLA.ts (НОВЫЙ)
│
└── features/
    └── WalletAuth/
        └── ui/
            └── DUNACLAAcceptor/ (НОВЫЙ)
                ├── DUNACLAAcceptor.tsx
                └── DUNACLAAcceptor.module.scss
```

### Обновлённые файлы

```
src/
├── features/
│   └── WalletAuth/
│       └── ui/
│           └── UnitProfileCreator/
│               └── UnitProfileCreator.tsx (ОБНОВИТЬ)
│
└── app/
    └── unit-profile/
        └── page.tsx (ОБНОВИТЬ)
```

---

## 🚀 Быстрый старт

### Шаг 1: Обновить типы

**Файл:** `src/shared/types/unit-profile.ts`

Добавить:

```typescript
export interface DUNACLA {
  version: string;
  acceptedAt: number;
  signature: string;
  githubUsername?: string;
  claType: 'electronic' | 'on-chain';
}

export interface UnitProfile {
  // ... существующие поля
  claAccepted?: DUNACLA; // ⭐ NEW
}
```

### Шаг 2: Создать хук

**Файл:** `src/shared/hooks/useDUNACLA.ts`

Скопировать из: [DSP_IP_ASSIGNMENT_INTEGRATION.md](./DSP_IP_ASSIGNMENT_INTEGRATION.md)

### Шаг 3: Создать компонент

**Файл:** `src/features/WalletAuth/ui/DUNACLAAcceptor/DUNACLAAcceptor.tsx`

Скопировать из: [DSP_IP_ASSIGNMENT_INTEGRATION.md](./DSP_IP_ASSIGNMENT_INTEGRATION.md)

### Шаг 4: Интегрировать в Unit Profile Creator

**Файл:** `src/features/WalletAuth/ui/UnitProfileCreator/UnitProfileCreator.tsx`

Добавить шаг CLA после создания unitname.

### Шаг 5: Интегрировать в Unit Profile Page

**Файл:** `src/app/unit-profile/page.tsx`

Добавить badge статуса CLA и модалку для принятия.

---

## 📊 Новый флоу пользователя

```
1. Connect Wallet (без изменений)
   ↓
2. Create Unit Profile (ввод unitname)
   ↓
3. ⭐ Accept DUNA-CLA (НОВЫЙ ШАГ)
   ↓
4. Access Unit Profile (полный доступ)
```

---

## ✅ Чеклист интеграции

- [ ] Типы данных добавлены
- [ ] Хук `useDUNACLA` создан
- [ ] Компонент `DUNACLAAcceptor` создан
- [ ] `UnitProfileCreator` обновлён
- [ ] `UnitProfilePage` обновлён
- [ ] Тесты написаны
- [ ] На stage протестировано
- [ ] На production задеплоено

---

## 🔗 Полная документация

**Для детального изучения:**

1. [DSP_IP_ASSIGNMENT_INTEGRATION.md](./DSP_IP_ASSIGNMENT_INTEGRATION.md) — полный план интеграции
2. [legal/03-IP-ASSIGNMENT/DUNA-CLA-v1.0.md](../../GYBER_EXPERIMENT_DOCS/legal/03-IP-ASSIGNMENT/templates/DUNA-CLA-v1.0.md) — текст соглашения
3. [legal/03-IP-ASSIGNMENT/GITHUB_CLA_SETUP.md](../../GYBER_EXPERIMENT_DOCS/legal/03-IP-ASSIGNMENT/GITHUB_CLA_SETUP.md) — настройка CLA Assistant

---

## ⏱️ Оценка времени

| Задача | Время |
|--------|-------|
| Типы данных | 1 час |
| Хук useDUNACLA | 2-3 часа |
| DUNACLAAcceptor компонент | 3-4 часа |
| Интеграция в UnitProfileCreator | 2 часа |
| Интеграция в UnitProfilePage | 2 часа |
| Тесты | 3-4 часа |
| **Итого** | **13-16 часов** |

---

## 🆘 Контакты

**Вопросы по IP Assignment:**
- legal@gyber.org
- [EXECUTIVE_SUMMARY.md](../../GYBER_EXPERIMENT_DOCS/legal/00-START_HERE/EXECUTIVE_SUMMARY.md)

**Вопросы по DSP Client:**
- [DSP README.md](../README.md)
- [DSP Architecture Docs](./architecture/)

---

*Quick Start для Gybernaty DSP Client*  
*Версия: 1.0*  
*Дата: 2026-03-08*
