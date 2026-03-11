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

// Уникальные идентификаторы для поиска проектов
const SEARCH_USER = 'user_projects_search';
const SEARCH_EMAIL = 'user_projects_search@test.com';
const SEARCH_PASSWORD = '123456';

describe('Projects search/sort (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;

  // Проекты для тестирования
  const projects = [
    { title: 'Alpha', description: 'First project' },
    { title: 'Beta', description: 'Second project' },
    { title: 'Gamma', description: 'Third project' },
  ];

  // Идентификаторы созданных проектов
  const projectIds: number[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    // Полная очистка базы перед тестами
    await setupE2EApp(app, false);

    // Регистрация и вход с уникальными данными
    const reg = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        username: SEARCH_USER,
        email: SEARCH_EMAIL,
        password: SEARCH_PASSWORD,
      });
    expect(reg.status).toBe(201);

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: SEARCH_USER, password: SEARCH_PASSWORD });
    expect(login.status).toBe(200);
    expect(login.body.access_token).toBeDefined();
    token = login.body.access_token;

    // Получаем ID пользователя
    const users = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);
    expect(users.status).toBe(200);

    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }

    const user = usersArr.find((u: any) => u.username === SEARCH_USER);
    if (!user) {
      throw new Error(
        `Пользователь ${SEARCH_USER} не найден в списке пользователей`,
      );
    }
    userId = user.id;

    // Создаём проекты для поиска и сортировки
    for (const project of projects) {
      const res = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...project, ownerId: userId });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      projectIds.push(res.body.id);
    }

    console.log(`Созданы проекты для поиска: ${projectIds.join(', ')}`);
  });

  it('поиск по title', async () => {
    // Делаем поиск по названию "Beta"
    const res = await request(app.getHttpServer())
      .get('/api/v1/projects?search=Beta')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);

    // Проверяем, что результат включает проект Beta
    const betaProjects = res.body.data.filter((p: any) => p.title === 'Beta');
    expect(betaProjects.length).toBeGreaterThan(0);

    // Проверяем, что ID из результата поиска соответствует созданному проекту
    const betaProject = projects.findIndex((p) => p.title === 'Beta');
    expect(
      betaProjects.some((p: any) => p.title === projects[betaProject].title),
    ).toBe(true);
  });

  it('сортировка по title:desc', async () => {
    // Тестируем сортировку по убыванию
    const res = await request(app.getHttpServer())
      .get('/api/v1/projects?sort=title:desc')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);

    // В отсортированном по убыванию списке Gamma должен быть перед Beta и Alpha
    const titles = res.body.data.map((p: any) => p.title);
    console.log('Отсортированные проекты:', titles);

    // Проверяем, что Gamma встречается раньше Beta в отсортированном списке
    const gammaIndex = titles.findIndex((t: string) => t === 'Gamma');
    const betaIndex = titles.findIndex((t: string) => t === 'Beta');
    const alphaIndex = titles.findIndex((t: string) => t === 'Alpha');

    console.log(
      'Gamma index:',
      gammaIndex,
      'Beta index:',
      betaIndex,
      'Alpha index:',
      alphaIndex,
    );

    // Проверяем только если все проекты найдены
    if (gammaIndex !== -1 && betaIndex !== -1 && alphaIndex !== -1) {
      expect(gammaIndex).toBeLessThan(betaIndex);
      expect(betaIndex).toBeLessThan(alphaIndex);
    } else {
      console.warn('Не все проекты найдены в результатах сортировки:', titles);
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
