import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create calls service.create', async () => {
    const dto = { username: 'a', email: 'b', password: 'c' };
    (service.create as jest.Mock).mockResolvedValue(dto);
    const req = { user: { roles: ['admin'] } };
    await expect(controller.create(dto as any, req as any)).resolves.toEqual(
      dto,
    );
    expect(service.create).toBeCalledWith(dto);
  });

  it('findAll calls service.findAll', async () => {
    (service.findAll as jest.Mock).mockResolvedValue([1]);
    await expect(controller.findAll()).resolves.toEqual([1]);
  });

  it('findOne calls service.findOne', async () => {
    (service.findOne as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(controller.findOne('1')).resolves.toEqual({ id: 1 });
  });

  it('update calls service.update', async () => {
    (service.update as jest.Mock).mockResolvedValue({ id: 1, username: 'x' });
    const req = { user: { roles: ['admin'] } };
    await expect(
      controller.update('1', { username: 'x' } as any, req as any),
    ).resolves.toEqual({ id: 1, username: 'x' });
  });

  it('remove calls service.remove', async () => {
    (service.remove as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.remove('1')).resolves.toBeUndefined();
  });
});
