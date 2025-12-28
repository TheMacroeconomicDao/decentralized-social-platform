# Полное удаление упоминаний GitLab

## Проблема
После применения брендинга все еще видны упоминания "GitLab Community Edition" и логотип GitLab в различных местах интерфейса.

## Решение

Созданы следующие файлы для полной замены всех упоминаний GitLab:

### 1. `gitlab-text-replace.js`
JavaScript скрипт, который автоматически заменяет все упоминания GitLab на "Community Lab by Gybernaty" на странице.

**Что делает:**
- Заменяет текст "GitLab Community Edition" → "Community Lab by Gybernaty"
- Заменяет "GitLab" → "Community Lab"
- Заменяет ссылки gitlab.com → gyber.org/lab
- Скрывает логотипы GitLab
- Обновляет мета-теги и атрибуты
- Работает в реальном времени при динамических изменениях DOM

### 2. Обновленный `gitlab-custom.css`
Добавлены стили для скрытия логотипов GitLab и стилизации замененного текста.

### 3. `fix-all-gitlab-text.sh`
Скрипт для автоматического применения всех исправлений.

## Применение

### Автоматический способ

```bash
# Полное применение брендинга (включая исправление текста)
./k8s/gitlab/custom/complete-branding.sh

# Или только исправление текста
./k8s/gitlab/custom/fix-all-gitlab-text.sh
```

### Ручной способ (через веб-интерфейс)

1. Откройте: https://gyber.org/lab
2. Войдите как root
3. Перейдите: **Admin Area → Appearance**

4. **В разделе "Custom HTML head":**
   Вставьте:
   ```html
   <script src="https://gyber.org/lab/assets/lab/text-replace.js"></script>
   ```

5. **В разделе "Custom CSS":**
   Скопируйте и вставьте содержимое файла:
   ```
   k8s/gitlab/custom/gitlab-custom.css
   ```

6. **В разделе "Title":**
   Установите: `Community Lab by Gybernaty`

7. **Сохраните изменения**

## Что будет исправлено

✅ Текст "GitLab Community Edition" на странице входа  
✅ Текст "GitLab" в навигации  
✅ Логотип GitLab в header  
✅ Текст в footer  
✅ Мета-теги страницы  
✅ Placeholder в формах  
✅ Alt и title атрибуты изображений  
✅ Ссылки на gitlab.com  

## Проверка

После применения:

1. Откройте страницу входа: https://gyber.org/lab/users/sign_in
2. Проверьте, что вместо "GitLab Community Edition" видно "Community Lab by Gybernaty"
3. Проверьте, что логотип GitLab скрыт
4. Откройте консоль браузера (F12) и убедитесь, что нет ошибок JavaScript

## Файлы

- `gitlab-text-replace.js` - JavaScript для замены текста
- `gitlab-custom.css` - Кастомные стили (обновлен)
- `fix-all-gitlab-text.sh` - Скрипт автоматического применения
- `complete-branding.sh` - Полный скрипт брендинга (обновлен)

## Примечания

- JavaScript скрипт работает автоматически после загрузки страницы
- Используется MutationObserver для отслеживания динамических изменений
- Все замены выполняются без перезагрузки страницы
- Скрипт не влияет на функциональность GitLab

