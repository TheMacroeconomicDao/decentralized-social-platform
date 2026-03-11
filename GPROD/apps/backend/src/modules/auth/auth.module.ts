import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { LocalStrategy } from './strategies/local.strategy.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { EnvHelper } from '../../common/helpers/env.helper.js';
import { PrismaModule } from '../../common/prisma.module.js';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: EnvHelper.get('JWT_SECRET'),
      signOptions: { expiresIn: EnvHelper.get('JWT_EXPIRES', '3600s') },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, LocalAuthGuard],
  exports: [JwtModule],
})
export class AuthModule {}
