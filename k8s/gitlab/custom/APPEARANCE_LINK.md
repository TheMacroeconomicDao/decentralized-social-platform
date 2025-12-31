# 🔗 Ссылки для настройки брендинга

## Прямая ссылка на страницу Appearance

**https://gyber.org/lab/admin/appearance**

## Альтернативный путь

1. Откройте главную страницу: **https://gyber.org/lab**
2. Войдите как `root` (пароль: `73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=`)
3. В левом меню нажмите на иконку **шестеренки** (⚙️) или **Admin Area**
4. В разделе **Settings** выберите **Appearance**

## Что нужно сделать на странице Appearance

### 1. Logo (Логотип)
- Нажмите **"Choose file"** или **"Browse"**
- Выберите файл: `k8s/gitlab/custom/assets-for-upload/logo.svg`

### 2. Favicon
- Нажмите **"Choose file"** или **"Browse"**
- Выберите файл: `k8s/gitlab/custom/assets-for-upload/favicon.svg`

### 3. Custom CSS
- Прокрутите до раздела **"Custom CSS"**
- Откройте файл: `k8s/gitlab/custom/gitlab-custom.css`
- Скопируйте **весь** содержимое файла
- Вставьте в поле **"Custom CSS"**

### 4. Custom HTML head
- Прокрутите до раздела **"Custom HTML head"**
- Вставьте следующее:
```html
<script src="https://gyber.org/lab/assets/lab/text-replace.js"></script>
```

### 5. Title
- Прокрутите до раздела **"Title"**
- Введите: `Community Lab by Gybernaty`

### 6. Сохраните
- Нажмите кнопку **"Save changes"** внизу страницы

## Быстрый доступ к файлам

Файлы находятся в проекте:
- Логотип: `k8s/gitlab/custom/assets-for-upload/logo.svg`
- Favicon: `k8s/gitlab/custom/assets-for-upload/favicon.svg`
- CSS: `k8s/gitlab/custom/gitlab-custom.css`

## Проверка

После сохранения:
1. Обновите страницу GitLab (F5)
2. Проверьте, что вместо "GitLab Community Edition" видно "Community Lab by Gybernaty"
3. Проверьте, что логотип GitLab заменен на ваш логотип




