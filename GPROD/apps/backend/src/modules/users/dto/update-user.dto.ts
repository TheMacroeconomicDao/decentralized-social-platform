import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto, UserRole } from './create-user.dto.js';
import {
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsIn,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Новое имя пользователя',
    required: false,
    example: 'new_username',
  })
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'Новый email',
    required: false,
    example: 'new@email.com',
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Новый пароль',
    required: false,
    example: 'newPassword123',
  })
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Новые роли',
    required: false,
    example: ['user', 'admin'],
    isArray: true,
    enum: UserRole,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn([UserRole.USER, UserRole.ADMIN], { each: true })
  roles?: UserRole[];
}
