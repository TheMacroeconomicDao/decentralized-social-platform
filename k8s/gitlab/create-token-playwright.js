const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Автоматическое создание GitLab токена через Playwright');
  console.log('');

  const GITLAB_URL = 'https://gitlab.gyber.org';
  const ROOT_USER = 'root';
  const ROOT_PASSWORD = '73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=';
  const TOKEN_NAME = `system-full-access-${Date.now()}`;
  const TOKEN_FILE = path.join(__dirname, '.gitlab-token');

  const browser = await chromium.launch({ 
    headless: false, // Показываем браузер для отладки
    slowMo: 500 // Замедляем для наглядности
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('📖 Открываю GitLab...');
    await page.goto(GITLAB_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Проверяем, не залогинены ли мы уже
    const isLoggedIn = await page.locator('text=Sign in').count() === 0;
    
    if (!isLoggedIn) {
      console.log('🔐 Выполняю вход...');
      
      // Нажимаем Sign in если есть
      const signInButton = page.locator('text=Sign in').first();
      if (await signInButton.count() > 0) {
        await signInButton.click();
        await page.waitForTimeout(1000);
      }

      // Заполняем форму входа
      await page.fill('input[name="user[login]"], input[type="text"]', ROOT_USER);
      await page.fill('input[name="user[password]"], input[type="password"]', ROOT_PASSWORD);
      
      // Нажимаем кнопку входа
      await page.click('button[type="submit"], input[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      console.log('✅ Вход выполнен');
    } else {
      console.log('✅ Уже залогинены');
    }

    console.log('🔑 Перехожу к созданию токена...');
    
    // Переходим к настройкам токенов
    const tokensUrl = `${GITLAB_URL}/-/user_settings/personal_access_tokens`;
    await page.goto(tokensUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Заполняем форму создания токена
    console.log('📝 Заполняю форму токена...');
    
    // Имя токена
    await page.fill('input[name="personal_access_token[name]"], input[placeholder*="Token name"], input[type="text"]', TOKEN_NAME);
    await page.waitForTimeout(500);

    // Выбираем все scopes
    const scopes = [
      'api',
      'read_user',
      'read_repository',
      'write_repository',
      'read_registry',
      'write_registry',
      'sudo',
      'admin_mode'
    ];

    for (const scope of scopes) {
      const checkbox = page.locator(`input[value="${scope}"], input[name*="${scope}"]`).first();
      if (await checkbox.count() > 0) {
        await checkbox.check();
        await page.waitForTimeout(200);
      }
    }

    // Устанавливаем срок действия (1 год)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    const expiresAtStr = expiresAt.toISOString().split('T')[0];
    
    const expiresInput = page.locator('input[type="date"], input[name*="expires"]').first();
    if (await expiresInput.count() > 0) {
      await expiresInput.fill(expiresAtStr);
    }

    await page.waitForTimeout(1000);

    // Нажимаем кнопку создания
    console.log('💾 Создаю токен...');
    const createButton = page.locator('button:has-text("Create"), button[type="submit"]').first();
    await createButton.click();
    
    // Ждем появления токена
    await page.waitForTimeout(3000);

    // Извлекаем токен
    console.log('🔍 Извлекаю токен...');
    
    // Ищем токен в различных возможных местах
    let token = null;
    
    // Вариант 1: в input с типом text
    const tokenInput = page.locator('input[type="text"][readonly], input[value^="glpat-"], input[value^="glrt-"]').first();
    if (await tokenInput.count() > 0) {
      token = await tokenInput.inputValue();
    }
    
    // Вариант 2: в code/pre элементе
    if (!token) {
      const tokenCode = page.locator('code, pre').filter({ hasText: /^glpat-|^glrt-/ }).first();
      if (await tokenCode.count() > 0) {
        token = await tokenCode.textContent();
        token = token.trim();
      }
    }
    
    // Вариант 3: в любом тексте на странице
    if (!token) {
      const pageText = await page.textContent('body');
      const tokenMatch = pageText.match(/(glpat-[a-zA-Z0-9_-]+|glrt-[a-zA-Z0-9_-]+)/);
      if (tokenMatch) {
        token = tokenMatch[1];
      }
    }

    if (token) {
      // Сохраняем токен
      fs.writeFileSync(TOKEN_FILE, token.trim(), { mode: 0o600 });
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ ТОКЕН СОЗДАН И СОХРАНЕН');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log(`   Имя: ${TOKEN_NAME}`);
      console.log(`   Токен: ${token.substring(0, 20)}... (скрыт)`);
      console.log(`   Файл: ${TOKEN_FILE}`);
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Ждем немного перед закрытием
      await page.waitForTimeout(2000);
    } else {
      console.log('❌ Не удалось найти токен на странице');
      console.log('💡 Токен мог быть создан, проверьте вручную в GitLab');
      console.log('   Сохраните скриншот страницы для проверки');
      
      // Ждем для ручной проверки
      await page.waitForTimeout(10000);
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
})();


