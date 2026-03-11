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

// Уникальные пользователи для RBAC тестов
const RBAC_ADMIN = {
  username: 'admin_rbac_test',
  email: 'admin_rbac_test@test.com',
  password: 'admin123',
  roles: ['admin'],
};

const RBAC_USER = {
  username: 'user_rbac_test',
  email: 'user_rbac_test@test.com',
  password: 'user123',
  roles: ['user'],
};

// Хелпер для регистрации и логина
async function registerAndLogin(
  app: INestApplication,
  user: any,
): Promise<string> {
  const reg = await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send(user);
  expect(reg.status).toBe(201);

  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ username: user.username, password: user.password });
  expect(res.status).toBe(200);
  expect(res.body.access_token).toBeDefined();

  return res.body.access_token;
}

describe('RBAC (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    // Очищаем базу данных
    await setupE2EApp(app, false);

    // Создаём admin и user с уникальными username/email
    adminToken = await registerAndLogin(app, RBAC_ADMIN);
    userToken = await registerAndLogin(app, RBAC_USER);

    // Получаем id пользователя для тестов
    const users = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(users.status).toBe(200);

    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }

    const foundUser = usersArr.find(
      (u: any) => u.username === RBAC_USER.username,
    );
    if (!foundUser) {
      throw new Error(
        `Пользователь ${RBAC_USER.username} не найден в списке пользователей`,
      );
    }

    userId = foundUser.id;
    console.log(`Тестируем RBAC для пользователя с ID: ${userId}`);
  });

  it('user не может удалить пользователя', async () => {
    // Проверяем, что обычный пользователь не может удалить другого пользователя
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('admin может удалить пользователя', async () => {
    // Проверяем содержимое токена
    const base64Payload = adminToken.split('.')[1];
    const payload = JSON.parse(
      Buffer.from(base64Payload, 'base64').toString('utf8'),
    );
    console.log('JWT Payload:', payload);

    // Получаем пользователя перед удалением, чтобы убедиться, что он активен
    const getUserBefore = await request(app.getHttpServer())
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getUserBefore.status).toBe(200);
    expect(getUserBefore.body.isActive).toBe(true);

    // Проверяем, что администратор может удалить пользователя
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

    // Проверяем, что пользователь помечен как неактивный и findOne его не находит
    const getUser = await request(app.getHttpServer())
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(getUser.status).toBe(404); // findOne возвращает 404 для неактивных пользователей
  });

  afterAll(async () => {
    try {
      await app.close();
    } catch (err) {
      console.error('Ошибка в afterAll:', err);
    }
  });
});
