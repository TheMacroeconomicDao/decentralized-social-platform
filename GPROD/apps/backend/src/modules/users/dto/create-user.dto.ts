import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Уникальное имя пользователя',
    minLength: 3,
    maxLength: 64,
    example: 'john_doe',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  username: string;

  @ApiProperty({
    description: 'Email пользователя',
    maxLength: 128,
    example: 'john@example.com',
  })
  @IsEmail()
  @MaxLength(128)
  email: string;

  @ApiProperty({
    description: 'Пароль (минимум 6 символов)',
    minLength: 6,
    maxLength: 128,
    example: 'superSecret123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @ApiProperty({
    description: 'Роли пользователя',
    example: ['user'],
    required: false,
    isArray: true,
    default: ['user'],
    enum: UserRole,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn([UserRole.USER, UserRole.ADMIN], { each: true })
  roles?: UserRole[];
}
