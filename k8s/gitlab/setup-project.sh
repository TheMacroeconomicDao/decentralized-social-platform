#!/bin/bash
set -e

echo "🚀 Настройка проекта в GitLab"
echo ""

# Проверка что мы в правильной директории
if [ ! -d ".git" ]; then
    echo "❌ Это не git репозиторий!"
    exit 1
fi

echo "📋 Текущий remote:"
git remote -v
echo ""

# Получение информации о проекте
PROJECT_NAME=$(basename $(pwd))
echo "📦 Имя проекта: $PROJECT_NAME"
echo ""

# Запрос URL GitLab проекта
echo "Введите URL вашего GitLab проекта:"
echo "   Пример: https://gitlab.gyber.org/username/$PROJECT_NAME.git"
echo "   Или:    git@gitlab.gyber.org:username/$PROJECT_NAME.git"
read -p "URL: " GITLAB_URL

if [ -z "$GITLAB_URL" ]; then
    echo "❌ URL не может быть пустым!"
    exit 1
fi

# Добавление remote
echo ""
echo "➕ Добавляю GitLab remote..."
if git remote get-url gitlab &>/dev/null; then
    echo "⚠️  Remote 'gitlab' уже существует. Обновляю..."
    git remote set-url gitlab "$GITLAB_URL"
else
    git remote add gitlab "$GITLAB_URL"
fi

echo "✅ Remote добавлен"
echo ""

# Показываем текущие remotes
echo "📋 Обновленные remotes:"
git remote -v
echo ""

# Предложение запушить
echo "🚀 Готово к push!"
echo ""
echo "Для пуша выполните:"
echo "   git push gitlab main"
echo ""
echo "Или для всех веток:"
echo "   git push gitlab --all"
echo ""

