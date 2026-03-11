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

describe('Body limit (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await setupE2EApp(app);
    const reg = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        username: 'bodylimit1',
        email: 'bodylimit1@mail.com',
        password: '123456',
      });
    expect(reg.status).toBe(201);
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'bodylimit1', password: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.access_token).toBeDefined();
    token = res.body.access_token;
    const users = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);
    expect(users.status).toBe(200);
    const usersArr = users.body.data ?? users.body;
    if (!Array.isArray(usersArr)) {
      console.error('users.body:', users.body);
      throw new Error('usersArr is not array');
    }
    userId = usersArr.find((u: any) => u.username === 'bodylimit1').id;
  });

  it('413 если body > 1MB', async () => {
    const big = 'x'.repeat(1024 * 1024 + 1);
    const res = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: big, description: 'desc', ownerId: userId });
    expect(res.status).toBe(413);
  });

  afterAll(async () => {
    try {
      await app.close();
    } catch (err) {
      console.error('Ошибка в afterAll:', err);
    }
  });
});
