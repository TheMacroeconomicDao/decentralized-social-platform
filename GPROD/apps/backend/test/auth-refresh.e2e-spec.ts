import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupE2EApp } from './setup-e2e';

jest.setTimeout(30000);

describe('Auth refresh (e2e)', () => {
  let app: INestApplication;
  let refresh_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await setupE2EApp(app);
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      username: 'refreshuser',
      email: 'refresh@mail.com',
      password: '123456',
    });
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'refreshuser', password: '123456' });
    refresh_token = res.body.refresh_token;
  });

  it('обновляет access_token по refresh_token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refresh_token });
    expect(res.body.access_token).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
