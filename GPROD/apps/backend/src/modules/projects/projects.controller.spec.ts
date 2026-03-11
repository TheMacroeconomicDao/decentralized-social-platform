import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
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

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create calls service.create', async () => {
    const dto = { title: 'proj', description: 'desc', ownerId: 42 };
    (service.create as jest.Mock).mockResolvedValue(dto);
    await expect(controller.create(dto)).resolves.toEqual(dto);
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
    (service.update as jest.Mock).mockResolvedValue({ id: 1, name: 'x' });
    await expect(controller.update('1', { name: 'x' } as any)).resolves.toEqual(
      { id: 1, name: 'x' },
    );
  });

  it('remove calls service.remove', async () => {
    const mockReq = {
      user: {
        roles: ['admin'],
        sub: 1,
      },
    };

    (service.findOne as jest.Mock).mockResolvedValue({ id: 1, ownerId: 1 });
    (service.remove as jest.Mock).mockResolvedValue({ success: true });

    await expect(controller.remove('1', mockReq)).resolves.toEqual({
      success: true,
    });
    expect(service.findOne).toBeCalledWith(1);
    expect(service.remove).toBeCalledWith(1);
  });
});
