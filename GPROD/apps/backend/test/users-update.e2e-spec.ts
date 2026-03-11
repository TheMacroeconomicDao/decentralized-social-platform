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

// Создаем уникальных пользователей для этого теста, чтобы избежать конфликтов
const ADMIN_USERNAME = 'admin_users_update';
const ADMIN_EMAIL = 'admin_users_update@test.com';
const ADMIN_PASSWORD = 'admin123';

const USER_USERNAME = 'user_users_update';
const USER_EMAIL = 'user_users_update@test.com';
const USER_PASSWORD = 'user123';

describe('Users update/soft-delete (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let userId: number;
  let adminId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    // Сбросим базу полностью перед началом тестирования
    await setupE2EApp(app, false);

    // Создаём админа
    console.log('Регистрируем админа:', ADMIN_USERNAME);
    const regAdmin = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        roles: ['admin'],
      });
    expect(regAdmin.status).toBe(201);
    console.log('Регистрация админа успешна:', regAdmin.body);

    // Логиним админа
    console.log('Логиним админа:', ADMIN_USERNAME);
    const loginAdmin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
      });
    expect(loginAdmin.status).toBe(200);
    expect(loginAdmin.body.access_token).toBeDefined();
    adminToken = loginAdmin.body.access_token;
    console.log('Логин админа успешен, получен токен');

    // Создаём обычного пользователя
    console.log('Регистрируем пользователя:', USER_USERNAME);
    const regUser = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        username: USER_USERNAME,
        email: USER_EMAIL,
        password: USER_PASSWORD,
      });
    expect(regUser.status).toBe(201);
    console.log('Регистрация пользователя успешна:', regUser.body);

    // Логиним пользователя
    console.log('Логиним пользователя:', USER_USERNAME);
    const loginUser = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        username: USER_USERNAME,
        password: USER_PASSWORD,
      });
    expect(loginUser.status).toBe(200);
    expect(loginUser.body.access_token).toBeDefined();
    userToken = loginUser.body.access_token;
    console.log('Логин пользователя успешен, получен токен');

    // Получаем ID обычного пользователя и админа
    console.log('Получаем список пользователей');
    const users = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(users.status).toBe(200);

    console.log('Список пользователей:', JSON.stringify(users.body));

    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }

    const adminUser = usersArr.find((u: any) => u.username === ADMIN_USERNAME);
    if (!adminUser) {
      throw new Error(
        `Админ ${ADMIN_USERNAME} не найден в списке пользователей`,
      );
    }
    adminId = adminUser.id;

    const foundUser = usersArr.find((u: any) => u.username === USER_USERNAME);
    if (!foundUser) {
      throw new Error(
        `Пользователь ${USER_USERNAME} не найден в списке пользователей`,
      );
    }

    userId = foundUser.id;
    console.log(
      `Начинаем тестирование с user ID: ${userId}, admin ID: ${adminId}`,
    );
  });

  it('user может обновить свой email', async () => {
    // Проверим текущий email пользователя
    const getUserBefore = await request(app.getHttpServer())
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    console.log(
      `Текущий email пользователя ${userId}:`,
      getUserBefore.body.email,
    );

    // Обновляем email
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ email: 'new_' + USER_EMAIL });

    console.log('Результат обновления email:', res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('new_' + USER_EMAIL);
  });

  it('user не может обновить roles', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ roles: ['admin'] });

    console.log(
      'Результат попытки обновления ролей пользователем:',
      res.status,
      res.body,
    );

    expect(res.status).toBe(403);
  });

  it('admin может обновить roles', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ roles: ['admin'] });

    console.log('Результат обновления ролей админом:', res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.roles).toContain('admin');
  });

  it('soft-delete (isActive=false) работает', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    console.log('Результат удаления пользователя:', res.status, res.body);

    expect(res.status).toBe(200);

    const user = await request(app.getHttpServer())
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    console.log(
      'Проверка пользователя после удаления:',
      user.status,
      user.body,
    );

    // Пользователь помечается как неактивный, поэтому findOne возвращает 404
    expect(user.status).toBe(404);
  });

  it('после удаления пользователя его проекты остаются, а владелец помечен как неактивный', async () => {
    // Создаём проект от имени админа для тестирования
    console.log('Создаем тестовый проект');
    const projectRes = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'project-for-deletion-test',
        description: 'desc for deletion test',
        ownerId: adminId,
      });

    console.log(
      'Результат создания проекта:',
      projectRes.status,
      projectRes.body,
    );

    expect(projectRes.status).toBe(201);

    const projectId = projectRes.body.id;
    console.log(`Создан проект с ID: ${projectId}`);

    // Удаляем пользователя админа
    const delRes = await request(app.getHttpServer())
      .delete(`/api/v1/users/${adminId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    console.log('Результат удаления админа:', delRes.status, delRes.body);

    expect(delRes.status).toBe(200);

    // Проверяем, что проект остался, а владелец помечен как неактивный
    const getProject = await request(app.getHttpServer())
      .get(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${userToken}`);

    console.log(
      'Проверка проекта после удаления владельца:',
      getProject.status,
      getProject.body,
    );

    expect(getProject.status).toBe(200);
    // ID владельца сохраняется
    expect(getProject.body.ownerId).toBe(adminId);
    // Владелец помечен как неактивный
    expect(getProject.body.owner.isActive).toBe(false);
  });

  afterAll(async () => {
    try {
      await app.close();
    } catch (err) {
      console.error('Ошибка в afterAll:', err);
    }
  });
});
