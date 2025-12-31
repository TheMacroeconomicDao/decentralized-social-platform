#!/bin/bash
set -e

echo "🚀 Автоматическое создание GitLab токена"
echo ""

# Получаем root пароль
POD_NAME=$(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}')
ROOT_PASS=$(kubectl exec -n gitlab $POD_NAME -- sh -c 'grep "Password:" /etc/gitlab/initial_root_password 2>/dev/null | awk "{print \$2}"')

if [ -z "$ROOT_PASS" ]; then
    echo "❌ Не удалось получить root пароль"
    exit 1
fi

echo "✅ Root пароль получен"
echo ""

# Запускаем port-forward
echo "🔌 Настраиваю port-forward..."
kubectl port-forward -n gitlab svc/gitlab 8080:80 > /tmp/gitlab-portforward.log 2>&1 &
PORTFORWARD_PID=$!
sleep 3

# Проверяем что port-forward работает
if ! curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "❌ Port-forward не работает"
    kill $PORTFORWARD_PID 2>/dev/null || true
    exit 1
fi

echo "✅ Port-forward работает на http://localhost:8080"
echo ""

# Устанавливаем Playwright если нужно
if ! npm list playwright 2>/dev/null | grep -q playwright; then
    echo "📦 Устанавливаю Playwright..."
    npm install playwright --save-dev --legacy-peer-deps 2>&1 | tail -3
    npx playwright install chromium 2>&1 | grep -E "(Downloading|Installing|chromium)" | tail -3
fi

# Создаем скрипт для создания токена
cat > /tmp/create-token.js <<'SCRIPT_EOF'
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const GITLAB_URL = 'http://localhost:8080';
  const ROOT_USER = 'root';
  const ROOT_PASSWORD = process.argv[2];
  const TOKEN_NAME = `system-full-access-${Date.now()}`;
  const TOKEN_FILE = process.argv[3];

  console.log('🌐 Открываю GitLab через port-forward...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });

  try {
    const page = await browser.newPage();
    await page.goto(GITLAB_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    console.log('🔐 Выполняю вход...');
    
    // Ищем кнопку Sign in или форму входа
    const signInLink = page.locator('a:has-text("Sign in"), text=Sign in').first();
    if (await signInLink.count() > 0) {
      await signInLink.click();
      await page.waitForTimeout(1000);
    }

    // Заполняем форму
    await page.fill('input[name="user[login]"], input[type="text"][placeholder*="Username"], input[type="text"][placeholder*="Email"]', ROOT_USER);
    await page.fill('input[name="user[password]"], input[type="password"]', ROOT_PASSWORD);
    
    await page.click('button[type="submit"]:has-text("Sign in"), input[type="submit"][value*="Sign"], button:has-text("Sign in")');
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    console.log('✅ Вход выполнен');
    console.log('🔑 Перехожу к созданию токена...');

    // Переходим к токенам
    await page.goto(`${GITLAB_URL}/-/user_settings/personal_access_tokens`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    console.log('📝 Заполняю форму...');
    
    // Имя токена
    await page.fill('input[name="personal_access_token[name]"], input[placeholder*="Token name"], input[type="text"]:not([type="password"])', TOKEN_NAME);
    await page.waitForTimeout(500);

    // Выбираем scopes
    const scopes = ['api', 'read_user', 'read_repository', 'write_repository', 'read_registry', 'write_registry', 'sudo', 'admin_mode'];
    for (const scope of scopes) {
      const checkbox = page.locator(`input[value="${scope}"], input[name*="${scope}"], label:has-text("${scope}") input`).first();
      if (await checkbox.count() > 0) {
        await checkbox.check();
        await page.waitForTimeout(200);
      }
    }

    await page.waitForTimeout(1000);

    // Создаем токен
    console.log('💾 Создаю токен...');
    await page.click('button:has-text("Create"), button[type="submit"]:has-text("Create"), button.btn-success');
    await page.waitForTimeout(5000);

    // Извлекаем токен
    let token = null;
    
    // Пробуем разные способы извлечения
    const tokenInput = page.locator('input[type="text"][readonly], input[value^="glpat-"], input[value^="glrt-"]').first();
    if (await tokenInput.count() > 0) {
      token = await tokenInput.inputValue();
    }
    
    if (!token) {
      const tokenCode = page.locator('code, pre, .token-value').filter({ hasText: /glpat-|glrt-/ }).first();
      if (await tokenCode.count() > 0) {
        token = (await tokenCode.textContent()).trim();
      }
    }

    if (!token) {
      const pageText = await page.textContent('body');
      const match = pageText.match(/(glpat-[a-zA-Z0-9_-]{20,})/);
      if (match) {
        token = match[1];
      }
    }

    if (token) {
      fs.writeFileSync(TOKEN_FILE, token.trim(), { mode: 0o600 });
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ ТОКЕН СОЗДАН И СОХРАНЕН');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Токен: ${token.substring(0, 20)}...`);
      console.log(`   Файл: ${TOKEN_FILE}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      await page.waitForTimeout(3000);
    } else {
      console.log('⚠️  Токен не найден автоматически, но мог быть создан');
      console.log('💡 Проверьте страницу вручную и сохраните токен');
      await page.waitForTimeout(10000);
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
})();
SCRIPT_EOF

echo "🚀 Запускаю автоматизацию..."
node /tmp/create-token.js "$ROOT_PASS" "$(pwd)/k8s/gitlab/.gitlab-token"

# Останавливаем port-forward
kill $PORTFORWARD_PID 2>/dev/null || true

# Добавляем в переменные окружения
if [ -f "k8s/gitlab/.gitlab-token" ] && [ -s "k8s/gitlab/.gitlab-token" ]; then
    echo ""
    echo "🔧 Добавляю токен в переменные окружения..."
    ./k8s/gitlab/setup-env-now.sh
else
    echo ""
    echo "❌ Токен не был создан. Попробуйте создать вручную."
fi


