import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { WinstonLogger } from '../../common/logger/winston.logger.js';

@Injectable()
export class ProjectsService {
  private readonly logger = new WinstonLogger('ProjectsService');

  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    this.logger.debug('create', undefined, { title: createProjectDto.title, ownerId: createProjectDto.ownerId });
    const owner = await this.prisma.user.findUnique({
      where: { id: createProjectDto.ownerId },
    });
    if (!owner) throw new NotFoundException('Owner not found');
    return this.prisma.project.create({
      data: {
        title: createProjectDto.title,
        description: createProjectDto.description,
        owner: { connect: { id: createProjectDto.ownerId } },
      },
      include: { owner: true },
    });
  }

  async findAll(page = 1, limit = 20, search?: string, sort?: string) {
    this.logger.debug('findAll', undefined, { page, limit, search, sort });
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    let orderBy: any = { id: 'asc' };
    if (sort) {
      const [field, dir] = sort.split(':');
      if (field && dir && ['asc', 'desc'].includes(dir)) {
        orderBy = { [field]: dir };
      }
    }
    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
        orderBy,
        include: { owner: true },
      }),
      this.prisma.project.count({ where }),
    ]);
    this.logger.debug('findAll result', undefined, { found: data.length, total });
    return { data, total };
  }

  async findOne(id: number) {
    this.logger.debug('findOne', undefined, { id });
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    this.logger.debug('update', undefined, { id });
    await this.findOne(id);
    const data: any = { ...updateProjectDto };
    if (updateProjectDto.ownerId) {
      const owner = await this.prisma.user.findUnique({
        where: { id: updateProjectDto.ownerId },
      });
      if (!owner) throw new NotFoundException('Owner not found');
      data.owner = { connect: { id: updateProjectDto.ownerId } };
    }
    return this.prisma.project.update({
      where: { id },
      data,
      include: { owner: true },
    });
  }

  async remove(id: number) {
    this.logger.debug('remove', undefined, { id });
    try {
      await this.findOne(id);
      await this.prisma.project.delete({ where: { id } });
      this.logger.debug('remove success', undefined, { id });
      return { success: true };
    } catch (err) {
      this.logger.error('remove failed', err?.stack);
      throw err;
    }
  }
}
