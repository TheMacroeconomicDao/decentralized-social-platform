#!/bin/bash
echo "Введите ваш новый Figma API ключ:"
read -s FIGMA_TOKEN
echo "Тестирую ключ..."
curl -s "https://api.figma.com/v1/me" -H "X-Figma-Token: $FIGMA_TOKEN"
echo ""
echo "Если видите информацию о пользователе - ключ работает!"
