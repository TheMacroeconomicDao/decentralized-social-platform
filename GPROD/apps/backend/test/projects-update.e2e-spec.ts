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

// Уникальные идентификаторы для теста проектов
const PROJECT_USER = 'user_projects_update';
const PROJECT_EMAIL = 'user_projects_update@test.com';
const PROJECT_PASSWORD = '123456';
const PROJECT_TITLE = 'Project Update Test';

describe('Projects update (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;
  let projectId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    // Полная очистка базы данных перед тестами
    await setupE2EApp(app, false);

    // Регистрация и вход с уникальными данными
    const reg = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        username: PROJECT_USER,
        email: PROJECT_EMAIL,
        password: PROJECT_PASSWORD,
      });
    expect(reg.status).toBe(201);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: PROJECT_USER, password: PROJECT_PASSWORD });
    expect(login.status).toBe(200);
    expect(login.body.access_token).toBeDefined();
    token = login.body.access_token;

    // Получение ID пользователя
    const users = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);
    expect(users.status).toBe(200);

    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }

    const user = usersArr.find((u: any) => u.username === PROJECT_USER);
    if (!user) {
      throw new Error(
        `Пользователь ${PROJECT_USER} не найден в списке пользователей`,
      );
    }
    userId = user.id;

    // Создание проекта для теста обновления
    const projectData = {
      title: PROJECT_TITLE,
      description: 'Project for update testing',
      ownerId: userId,
    };

    const projectRes = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(projectData);

    expect(projectRes.status).toBe(201);
    expect(projectRes.body.title).toBe(PROJECT_TITLE);
    expect(projectRes.body.id).toBeDefined();

    projectId = projectRes.body.id;
    console.log(`Создан проект ID: ${projectId} для теста обновления`);
  });

  it('user может обновить свой проект', async () => {
    // Обновляем проект
    const updatedTitle = 'Updated Project Title';
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: updatedTitle });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updatedTitle);

    // Проверяем, что проект действительно обновился в базе
    const getProject = await request(app.getHttpServer())
      .get(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getProject.status).toBe(200);
    expect(getProject.body.title).toBe(updatedTitle);
  });

  it('без JWT нельзя обновить проект', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/projects/${projectId}`)
      .send({ title: 'fail' });
    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    try {
      await app.close();
    } catch (err) {
      console.error('Ошибка в afterAll:', err);
    }
  });
});
