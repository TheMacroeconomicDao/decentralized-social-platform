import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import type { Request as ExpressRequest } from 'express';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../../common/dto/api-error-response.dto.js';
import { CriticalRateLimit } from '../../common/decorators/rate-limit.decorator.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

class LoginDto {
  username: string;
  password: string;
}

class RefreshTokenDto {
  refresh_token: string;
}

@ApiTags('auth')
@ApiExtraModels(ApiErrorResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя (лимит 5 req/min)' })
  @CriticalRateLimit(5, 60)
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь зарегистрирован',
    schema: {
      example: {
        id: 1,
        username: 'john_doe',
        email: 'john@example.com',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Валидационная ошибка',
    type: ApiErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Пользователь уже существует',
    type: ApiErrorResponseDto,
    schema: {
      example: {
        statusCode: 409,
        message: 'User already exists',
        error: 'Conflict',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка',
    type: ApiErrorResponseDto,
  })
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({
    summary: 'Логин пользователя (через Guard, лимит 10 req/min)',
  })
  @CriticalRateLimit(10, 60)
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'JWT токен',
    schema: {
      example: {
        access_token: 'jwt.token.here',
        refresh_token: 'refresh.token.here',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Неверные креды',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка',
    type: ApiErrorResponseDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  login(@Request() req: ExpressRequest) {
    const user = req.user as { username: string } | undefined;
    if (!user || !user.username) throw new Error('No user in request');
    return this.authService.login(user.username, req.body.password);
  }

  @ApiOperation({ summary: 'Обновить access_token по refresh_token' })
  @CriticalRateLimit(20, 60)
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Новый access_token',
    schema: { example: { access_token: '...' } },
  })
  @ApiUnauthorizedResponse({
    description: 'Неверный или истекший refresh токен',
    type: ApiErrorResponseDto,
  })
  @Post('refresh')
  @HttpCode(200)
  refresh(@Body('refresh_token') refresh_token: string) {
    return this.authService.refresh(refresh_token);
  }

  @ApiOperation({ summary: 'Выход из системы (логаут) и отзыв токена' })
  @CriticalRateLimit(10, 60)
  @ApiBearerAuth()
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh токен для отзыва',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный выход из системы',
    schema: { example: { message: 'Logout successful' } },
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: ApiErrorResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(
    @Request() req: ExpressRequest,
    @Body('refresh_token') refresh_token: string,
  ) {
    const user = req.user as { userId: number } | undefined;
    if (!user || !user.userId) throw new Error('No user in request');

    await this.authService.logout(user.userId, refresh_token);

    return { message: 'Logout successful' };
  }
}
