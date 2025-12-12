#!/bin/bash

# Скрипт для проверки потребления памяти процессами

echo "=== Потребление памяти процессами ==="
echo ""

# Node.js процессы
echo "📊 Node.js процессы:"
ps aux | grep -E "node|next" | grep -v grep | awk '{printf "%-10s %6s MB %s\n", $2, int($6/1024), $11}' | sort -k2 -rn | head -10

echo ""
echo "📊 Docker контейнеры:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null || echo "Docker не запущен"

echo ""
echo "📊 Топ процессов по памяти:"
ps aux | sort -k6 -rn | head -10 | awk '{printf "%-10s %6s MB %s\n", $2, int($6/1024), $11}'

echo ""
echo "💾 Общая память системы:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    vm_stat | perl -ne '/page size of (\d+)/ and $size=$1; /Pages\s+([^:]+)[^\d]+(\d+)/ and printf("%-16s % 16.2f Mi\n", "$1:", $2 * $size / 1048576);'
    echo ""
    sysctl hw.memsize | awk '{printf "Total: %.2f GB\n", $2/1024/1024/1024}'
else
    # Linux
    free -h
fi

echo ""
echo "🔍 Проверка запущенных Next.js dev серверов:"
lsof -i :3000 2>/dev/null || echo "Порт 3000 свободен"

echo ""
echo "✅ Рекомендации:"
echo "1. Закройте неиспользуемые процессы Node.js"
echo "2. Остановите неиспользуемые Docker контейнеры: docker ps -a"
echo "3. Очистите Docker: docker system prune -a (осторожно!)"
echo "4. Перезапустите dev сервер с новыми настройками памяти"
