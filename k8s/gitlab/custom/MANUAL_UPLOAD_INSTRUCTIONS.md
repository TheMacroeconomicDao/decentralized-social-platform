# Инструкция по ручной загрузке логотипа и favicon

## Проблема
В интерфейсе GitLab Appearance можно выбрать только локальные файлы, нельзя ввести URL.

## Решение

### Вариант 1: Скачать файлы локально (рекомендуется)

1. **Подготовьте файлы локально:**
   ```bash
   ./k8s/gitlab/custom/download-assets-local.sh
   ```
   
   Это создаст директорию `k8s/gitlab/custom/assets-for-upload` с файлами:
   - `logo.svg` - логотип
   - `favicon.svg` - favicon

2. **Откройте GitLab:**
   - URL: https://gyber.org/lab
   - Войдите как root

3. **Перейдите в Appearance:**
   - Admin Area → Appearance

4. **Загрузите файлы:**
   - В разделе **"Logo"**: нажмите "Choose file" и выберите `k8s/gitlab/custom/assets-for-upload/logo.svg`
   - В разделе **"Favicon"**: нажмите "Choose file" и выберите `k8s/gitlab/custom/assets-for-upload/favicon.svg`

5. **Сохраните изменения**

### Вариант 2: Использовать файлы из pod (если доступен файловый менеджер)

Файлы уже скопированы в pod по адресам:
- `/var/opt/gitlab/gitlab-rails/public/uploads/appearance/logo.svg`
- `/var/opt/gitlab/gitlab-rails/public/uploads/appearance/favicon.svg`

Если у вас есть доступ к файловой системе pod, используйте эти пути.

### Вариант 3: Скачать файлы через браузер

1. Откройте в браузере:
   - https://gyber.org/lab/assets/lab/lab-logo.svg
   - https://gyber.org/lab/assets/lab/lab-favicon.svg

2. Сохраните файлы на компьютер (ПКМ → "Сохранить как...")

3. Загрузите сохраненные файлы в GitLab через веб-интерфейс

## Дополнительные настройки

После загрузки логотипа и favicon:

1. **Custom CSS:**
   - Скопируйте содержимое файла `k8s/gitlab/custom/gitlab-custom.css`
   - Вставьте в раздел "Custom CSS"

2. **Custom HTML head:**
   - Вставьте:
   ```html
   <script src="https://gyber.org/lab/assets/lab/text-replace.js"></script>
   ```

3. **Title:**
   - Установите: `Community Lab by Gybernaty`

4. **Сохраните все изменения**

## Проверка

После применения всех настроек:
- ✅ Логотип GitLab заменен на логотип Community Lab
- ✅ Favicon обновлен
- ✅ Все упоминания "GitLab" заменены на "Community Lab by Gybernaty"
- ✅ Применены кастомные стили Gybernaty

