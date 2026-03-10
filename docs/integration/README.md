# DSP Integration Documentation

Документация по интеграции внешних систем и сервисов в DSP Client.

---

## 📁 Документы

### IP Assignment Integration

**Интеграция с системой передачи авторских прав Gybernaty DUNA**

| Документ | Назначение | Время на чтение |
|----------|------------|-----------------|
| **[QUICK_START.md](./QUICK_START.md)** | 🚀 Быстрый старт для разработчиков | 5 минут |
| **[DSP_IP_ASSIGNMENT_INTEGRATION.md](./DSP_IP_ASSIGNMENT_INTEGRATION.md)** | 📖 Полный план интеграции | 30 минут |

**Что внутри:**
- Типы данных (TypeScript)
- Хук `useDUNACLA` для управления CLA
- UI компонент `DUNACLAAcceptor`
- Интеграция в Unit Profile флоу
- Диаграммы последовательности
- Roadmap внедрения

**Затронутые файлы:**
- `src/shared/types/unit-profile.ts`
- `src/shared/hooks/useDUNACLA.ts` (новый)
- `src/features/WalletAuth/ui/DUNACLAAcceptor/` (новый)
- `src/features/WalletAuth/ui/UnitProfileCreator/`
- `src/app/unit-profile/page.tsx`

**Оценка времени:** 13-16 часов (~2-3 дня)

---

## 🔗 Внешние ресурсы

### Legal Documentation

- [DUNA-CLA Template](../../GYBER_EXPERIMENT_DOCS/legal/03-IP-ASSIGNMENT/templates/DUNA-CLA-v1.0.md)
- [IP Assignment Complete](../../GYBER_EXPERIMENT_DOCS/legal/03-IP-ASSIGNMENT/IP_ASSIGNMENT_COMPLETE.md)
- [GitHub CLA Setup](../../GYBER_EXPERIMENT_DOCS/legal/03-IP-ASSIGNMENT/GITHUB_CLA_SETUP.md)
- [Executive Summary](../../GYBER_EXPERIMENT_DOCS/legal/00-START_HERE/EXECUTIVE_SUMMARY.md)

### DSP Documentation

- [DSP README](../README.md)
- [Architecture Docs](./architecture/)
- [Contribution Guide](../docs/contribution/README.md)

---

## 📊 Статус интеграций

| Интеграция | Статус | Документация | Готовность кода |
|------------|--------|--------------|-----------------|
| **IP Assignment** | 📋 Design | ✅ Готова | ⏳ Требуется реализация |
| GitHub CLA Assistant | ⏳ Planned | ✅ Готова | ⏳ Требуется настройка |
| On-Chain Registry | ⏳ Planned | ✅ Готова | ⏳ Требуется деплой |

---

## 🚀 Быстрый старт для новой интеграции

1. **Изучить QUICK_START.md** — 5 минут
2. **Прочитать полный план** — 30 минут
3. **Создать GitHub issue** — tracking задачи
4. **Реализовать по шагам** — следовать документации
5. **Написать тесты** — unit + integration
6. **Протестировать на stage** — перед production
7. **Задеплоить** — production deployment

---

*Integration Documentation for Gybernaty DSP*  
*Last Updated: 2026-03-08*
