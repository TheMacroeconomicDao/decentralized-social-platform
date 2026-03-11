import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeEach(async () => {
    const userMock = {
      id: 1,
      username: 'vasya',
      email: 'vasya@mail.com',
      password: 'hash',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: ['user'],
    };
    module = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret' })],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn().mockResolvedValue(userMock),
            findByEmail: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    service.validateUser = jest.fn().mockResolvedValue(userMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login включает roles в payload', async () => {
    const user = {
      id: 1,
      username: 'vasya',
      password: 'hash',
      roles: ['admin'],
    };
    service.validateUser = jest.fn().mockResolvedValue(user);
    const jwtService = module.get<JwtService>(JwtService);
    jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValueOnce('token')
      .mockResolvedValueOnce('refresh');
    const result = await service.login('vasya', 'qwerty');
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 1,
      username: 'vasya',
      roles: ['admin'],
    });
    expect(result).toEqual({ access_token: 'token', refresh_token: 'refresh' });
  });
});
