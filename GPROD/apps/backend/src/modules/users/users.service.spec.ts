import { UsersService } from './users.service.js';
import { PrismaClient } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    service = new UsersService(prisma);
    // @ts-ignore
    service.prisma = prisma;
    prisma.user.findFirst = jest.fn();
    prisma.user.update = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create calls prisma.user.create', async () => {
    const dto = { username: 'a', email: 'b', password: 'c' };
    prisma.user.create = jest.fn().mockResolvedValue(dto);
    await expect(service.create(dto as any)).resolves.toEqual(dto);
    expect(prisma.user.create).toBeCalledWith({ data: dto });
  });

  it('findAll calls prisma.user.findMany/count', async () => {
    prisma.user.findMany = jest.fn().mockResolvedValue([1]);
    prisma.user.count = jest.fn().mockResolvedValue(1);
    await expect(service.findAll()).resolves.toEqual({ data: [1], total: 1 });
  });

  it('findOne returns user or throws', async () => {
    prisma.user.findFirst = jest.fn().mockResolvedValue({ id: 1 });
    await expect(service.findOne(1)).resolves.toEqual({ id: 1 });
    prisma.user.findFirst = jest.fn().mockResolvedValue(null);
    await expect(service.findOne(2)).rejects.toThrow('User not found');
  });

  it('update calls prisma.user.update', async () => {
    prisma.user.findFirst = jest.fn().mockResolvedValue({ id: 1 });
    prisma.user.update = jest.fn().mockResolvedValue({ id: 1, username: 'x' });
    await expect(service.update(1, { username: 'x' } as any)).resolves.toEqual({
      id: 1,
      username: 'x',
    });
  });

  it('remove calls prisma.user.update (soft-delete)', async () => {
    prisma.user.findFirst = jest.fn().mockResolvedValue({ id: 1 });
    prisma.user.update = jest
      .fn()
      .mockResolvedValue({ id: 1, isActive: false });
    await expect(service.remove(1)).resolves.toEqual({ success: true });
  });

  it('findByUsername calls prisma.user.findUnique', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({ id: 1 });
    await expect(service.findByUsername('a')).resolves.toEqual({ id: 1 });
  });

  it('findByEmail calls prisma.user.findUnique', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({ id: 2 });
    await expect(service.findByEmail('b')).resolves.toEqual({ id: 2 });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
