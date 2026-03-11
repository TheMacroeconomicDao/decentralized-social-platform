// Глобальная настройка для e2e тестов
jest.setTimeout(60000);

// Глобальная обработка незакрытых промисов
process.on('unhandledRejection', (reason, promise) => {
  console.error('Непойманное отклонение (unhandledRejection):', promise, 'причина:', reason);
});

// Общая функция очистки после всех тестов
afterAll(async () => {
  // Добавляем задержку для завершения всех асинхронных процессов
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Принудительно запускаем сборщик мусора для очистки ресурсов
  if (global.gc) {
    global.gc();
  }
});
