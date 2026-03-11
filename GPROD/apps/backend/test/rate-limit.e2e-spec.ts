jest.setTimeout(30000);
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupE2EApp } from './setup-e2e';

describe('Rate-limit (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await setupE2EApp(app);
  });

  it('429 если слишком много запросов', async () => {
    let res: any = { status: 0 };
    for (let i = 0; i < 110; i++) {
      res = await request(app.getHttpServer()).get('/api/v1/health');
      if (res.status === 429) break;
    }
    expect(res.status).toBe(429);
  });

  afterAll(async () => {
    await app.close();
  });
});
