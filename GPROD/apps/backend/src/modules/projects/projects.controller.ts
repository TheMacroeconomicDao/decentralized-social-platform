import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiExtraModels,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../../common/dto/api-error-response.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RateLimit } from '../../common/decorators/rate-limit.decorator.js';

@ApiTags('projects')
@ApiBearerAuth()
@ApiExtraModels(ApiErrorResponseDto)
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({
    summary:
      'Создать проект (требуется JWT, лимит 10 req/min, роль: user/admin)',
  })
  @RateLimit(10, 60)
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Проект создан',
    schema: {
      example: {
        id: 1,
        title: 'My Project',
        description: 'Описание',
        ownerId: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Валидационная ошибка',
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Нет JWT',
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Нет прав', type: ApiErrorResponseDto })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка',
    type: ApiErrorResponseDto,
  })
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @ApiOperation({
    summary:
      'Получить список проектов (JWT, пагинация, поиск, сортировка, лимит 30 req/min, роль: user/admin)',
  })
  @RateLimit(30, 60)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'my',
    description: 'Поиск по названию/описанию',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    example: 'createdAt:desc',
    description: 'Сортировка, например: createdAt:desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Список проектов',
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: 'My Project',
            description: 'Описание',
            ownerId: 1,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        total: 1,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Нет JWT',
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Нет прав', type: ApiErrorResponseDto })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка',
    type: ApiErrorResponseDto,
  })
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    // Передаем все параметры в сервис
    return this.projectsService.findAll(
      Number(page),
      Number(limit),
      search,
      sort,
    );
  }

  @ApiOperation({ summary: 'Получить проект по id (JWT, роль: user/admin)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Проект найден',
    schema: {
      example: {
        id: 1,
        title: 'My Project',
        description: 'Описание',
        ownerId: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Проект не найден',
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Нет JWT',
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Нет прав', type: ApiErrorResponseDto })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка',
    type: ApiErrorResponseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновить проект (JWT, роль: user/admin)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: 200,
    description: 'Проект обновлён',
    schema: {
      example: {
        id: 1,
        title: 'New Title',
        description: 'Новое описание',
        ownerId: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Валидационная ошибка',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Проект не найден',
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Нет JWT',
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Нет прав', type: ApiErrorResponseDto })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка',
    type: ApiErrorResponseDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @ApiOperation({
    summary: 'Удалить проект (JWT, роль: admin или владелец проекта)',
  })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Проект удалён',
    schema: { example: { success: true } },
  })
  @ApiNotFoundResponse({
    description: 'Проект не найден',
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Нет JWT',
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Нет прав', type: ApiErrorResponseDto })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка',
    type: ApiErrorResponseDto,
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const project = await this.projectsService.findOne(+id);
    const userIdFromToken = req.user.sub || req.user.userId;

    // Проверяем права: admin может удалять любой проект, user только свой
    if (
      !req.user.roles?.includes('admin') &&
      Number(project.ownerId) !== Number(userIdFromToken)
    ) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    return this.projectsService.remove(+id);
  }
}
