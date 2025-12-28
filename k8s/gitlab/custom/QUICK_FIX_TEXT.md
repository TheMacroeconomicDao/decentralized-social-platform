# Быстрое исправление текста GitLab

## Проблема
После применения брендинга все еще видны упоминания "GitLab Community Edition" и логотип GitLab.

## Быстрое решение (3 шага)

### Шаг 1: Запустите скрипт
```bash
./k8s/gitlab/custom/fix-all-gitlab-text.sh
```

### Шаг 2: Откройте веб-интерфейс
1. Откройте: https://gyber.org/lab
2. Войдите как root
3. Перейдите: **Admin Area → Appearance**

### Шаг 3: Примените настройки

**В разделе "Custom HTML head":**
```html
<script src="https://gyber.org/lab/assets/lab/text-replace.js"></script>
```

**В разделе "Custom CSS":**
Скопируйте содержимое файла `k8s/gitlab/custom/gitlab-custom.css`

**В разделе "Title":**
```
Community Lab by Gybernaty
```

**Сохраните изменения**

## Результат

✅ Все упоминания "GitLab" заменены на "Community Lab by Gybernaty"  
✅ Логотип GitLab скрыт  
✅ Текст на странице входа обновлен  
✅ Все ссылки обновлены  

## Проверка

Откройте страницу входа и убедитесь, что вместо "GitLab Community Edition" видно "Community Lab by Gybernaty".

