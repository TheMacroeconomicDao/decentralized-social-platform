import { ProjectsService } from './projects.service.js';

const mockPrisma = {
  user: { findUnique: jest.fn() },
  project: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    service = new ProjectsService(mockPrisma as any);
    // @ts-ignore
    service.prisma = mockPrisma;
    Object.values(mockPrisma.user).forEach((fn) => fn.mockReset());
    Object.values(mockPrisma.project).forEach((fn) => fn.mockReset());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create calls prisma.project.create', async () => {
    const dto = { title: 'proj', description: 'desc', ownerId: 42 };
    const expectedCreateArg = {
      data: {
        title: 'proj',
        description: 'desc',
        owner: { connect: { id: 42 } },
      },
      include: { owner: true },
    };
    mockPrisma.user.findUnique.mockResolvedValue({ id: 42 });
    mockPrisma.project.create.mockResolvedValue({ ...dto });
    await expect(service.create(dto as any)).resolves.toEqual({ ...dto });
    expect(mockPrisma.project.create).toBeCalledWith(expectedCreateArg);
  });

  it('findAll calls prisma.project.findMany/count', async () => {
    mockPrisma.project.findMany.mockResolvedValue([1]);
    mockPrisma.project.count.mockResolvedValue(1);
    await expect(service.findAll()).resolves.toEqual({ data: [1], total: 1 });
  });

  it('findOne returns project or throws', async () => {
    mockPrisma.project.findUnique.mockResolvedValue({ id: 1 });
    await expect(service.findOne(1)).resolves.toEqual({ id: 1 });
    mockPrisma.project.findUnique.mockResolvedValue(null);
    await expect(service.findOne(2)).rejects.toThrow('Project not found');
  });

  it('update calls prisma.project.update', async () => {
    mockPrisma.project.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.project.update.mockResolvedValue({ id: 1, name: 'x' });
    await expect(service.update(1, { name: 'x' } as any)).resolves.toEqual({
      id: 1,
      name: 'x',
    });
  });

  it('remove calls prisma.project.delete', async () => {
    mockPrisma.project.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.project.delete.mockResolvedValue(undefined);
    await expect(service.remove(1)).resolves.toEqual({ success: true });
  });
});
