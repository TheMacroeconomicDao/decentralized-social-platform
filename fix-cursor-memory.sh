#!/bin/bash
echo "🚨 ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ ПАМЯТИ CURSOR"
echo "════════════════════════════════════════"
echo ""
echo "1. Останавливаем зависшие процессы Next.js..."
ps aux | grep "next build" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null
echo "✅ Готово"
echo ""
echo "2. Очищаем кеш Next.js..."
rm -rf .next node_modules/.cache 2>/dev/null
echo "✅ Готово"
echo ""
echo "3. Анализируем память Cursor..."
CURSOR_MEM=$(ps aux | grep -i cursor | grep -v grep | awk '{sum+=$6} END {print int(sum/1024)}')
echo "📊 Cursor потребляет: ${CURSOR_MEM} MB"
echo ""
if [ "$CURSOR_MEM" -gt 2000 ]; then
    echo "⚠️  КРИТИЧНО! Cursor потребляет больше 2GB!"
    echo ""
    read -p "Перезапустить Cursor? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        killall Cursor 2>/dev/null
        echo "✅ Cursor перезапущен. Подождите 10 секунд и откройте заново."
    fi
fi
echo ""
echo "✅ Готово!"
