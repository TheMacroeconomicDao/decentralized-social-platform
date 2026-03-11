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

describe('Forbidden/Unauthorized (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;
  let projectId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    await setupE2EApp(app, false);

    // Регистрация
    const reg = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ username: 'forb', email: 'forb@mail.com', password: '123456' });
    expect(reg.status).toBe(201);

    // Логин
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'forb', password: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.access_token).toBeDefined();
    token = res.body.access_token;

    // Получаем id пользователя
    const users = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);
    expect(users.status).toBe(200);

    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }

    userId = usersArr[0].id;

    // Создаём проект
    const project = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Forb', description: 'desc', ownerId: userId });

    expect(project.status).toBe(201);
    projectId = project.body.id;
    console.log(`Создан проект с ID: ${projectId}`);
  });

  it('unauthorized возвращает 401', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/projects');
    expect(res.status).toBe(401);
  });

  it('создание проекта без авторизации возвращает 401', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .send({ title: 'Forb', description: 'desc' });
    expect(res.status).toBe(401);
  });

  it('user не может удалить чужой проект', async () => {
    // создаём второго пользователя
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ username: 'forb2', email: 'forb2@mail.com', password: '123456' });
    const res2 = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'forb2', password: '123456' });
    const token2 = res2.body.access_token;
    const del = await request(app.getHttpServer())
      .delete(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token2}`);
    expect(del.status).toBe(403);
  });

  it('user может удалить свой проект', async () => {
    // Создаём новый проект
    console.log(
      'Создаем новый проект для проверки удаления пользователем. Текущий userId:',
      userId,
    );
    const newProject = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'To delete',
        description: 'Project for deletion',
        ownerId: userId,
      });

    console.log(
      'Результат создания проекта:',
      newProject.status,
      JSON.stringify(newProject.body),
    );
    expect(newProject.status).toBe(201);
    const newProjectId = newProject.body.id;

    // Получаем созданный проект для проверки владельца
    const getProject = await request(app.getHttpServer())
      .get(`/api/v1/projects/${newProjectId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('Данные созданного проекта:', getProject.body);
    console.log(
      'ownerId проекта:',
      getProject.body.ownerId,
      'userId текущего пользователя:',
      userId,
    );

    // Удаляем свой проект
    console.log('Попытка удалить проект', newProjectId);
    const del = await request(app.getHttpServer())
      .delete(`/api/v1/projects/${newProjectId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('Результат удаления:', del.status, del.body);
    expect(del.status).toBe(200);
  });

  afterAll(async () => {
    try {
      // Очищаем базу данных после тестов
      await request(app.getHttpServer())
        .delete(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      await app.close();
    } catch (err) {
      console.error('Ошибка в afterAll:', err);
    }
  });
});
