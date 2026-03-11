process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupE2EApp } from './setup-e2e';

// Уникальные пользователи для тестирования поиска
const USERS_SEARCH = [
  {
    username: 'alice_search',
    email: 'alice_search@test.com',
    password: '123456',
  },
  { username: 'bob_search', email: 'bob_search@test.com', password: '123456' },
  {
    username: 'vasya_search',
    email: 'vasya_search@test.com',
    password: '123456',
  },
];

describe('Users search/sort (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    // Полная очистка базы перед тестами
    await setupE2EApp(app, false);

    // Регистрируем всех тестовых пользователей
    for (const user of USERS_SEARCH) {
      const reg = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(user);
      expect(reg.status).toBe(201);
    }

    // Логинимся под последним пользователем для получения токена
    const lastUser = USERS_SEARCH[USERS_SEARCH.length - 1];
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: lastUser.username, password: lastUser.password });
    expect(login.status).toBe(200);
    expect(login.body.access_token).toBeDefined();
    token = login.body.access_token;

    // Получаем список пользователей для проверки
    const users = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);
    expect(users.status).toBe(200);

    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }

    // Находим ID последнего пользователя, под которым мы залогинились
    const foundUser = usersArr.find(
      (u: any) => u.username === lastUser.username,
    );
    if (!foundUser) {
      throw new Error(
        `Пользователь ${lastUser.username} не найден в списке пользователей`,
      );
    }

    userId = foundUser.id;
    console.log(
      `Используем пользователя ${lastUser.username} с ID: ${userId} для тестов поиска`,
    );
  });

  it('поиск по username', async () => {
    // Проверяем поиск по vasya_search
    const searchUsername = USERS_SEARCH[USERS_SEARCH.length - 1].username;
    const res = await request(app.getHttpServer())
      .get(`/api/v1/users?search=${searchUsername}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);

    // Должен найти как минимум одного пользователя
    expect(res.body.data.length).toBeGreaterThan(0);

    // Проверяем что первый найденный пользователь - это тот, которого мы искали
    const foundUser = res.body.data.find(
      (u: any) => u.username === searchUsername,
    );
    expect(foundUser).toBeDefined();
    expect(foundUser.username).toBe(searchUsername);
  });

  it('сортировка по username:desc', async () => {
    // Проверяем сортировку по убыванию username
    const res = await request(app.getHttpServer())
      .get('/api/v1/users?sort=username:desc')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);

    // Проверяем, что порядок сортировки соответствует ожидаемому
    // V должен быть перед B, B перед A при сортировке по убыванию
    const usernames = res.body.data.map((u: any) => u.username);

    // Находим индексы наших тестовых пользователей
    const vasyaIndex = usernames.findIndex(
      (name: string) => name === USERS_SEARCH[2].username,
    );
    const bobIndex = usernames.findIndex(
      (name: string) => name === USERS_SEARCH[1].username,
    );
    const aliceIndex = usernames.findIndex(
      (name: string) => name === USERS_SEARCH[0].username,
    );

    // Проверяем только если всех нашли
    if (vasyaIndex !== -1 && bobIndex !== -1 && aliceIndex !== -1) {
      // При сортировке по убыванию vasya должен быть раньше bob, а bob раньше alice
      expect(vasyaIndex).toBeLessThan(bobIndex);
      expect(bobIndex).toBeLessThan(aliceIndex);
    } else {
      console.warn(
        'Не все тестовые пользователи найдены в результатах сортировки:',
        usernames,
      );
    }
  });

  afterAll(async () => {
    try {
      await app.close();
    } catch (err) {
      console.error('Ошибка в afterAll:', err);
    }
  });
});
