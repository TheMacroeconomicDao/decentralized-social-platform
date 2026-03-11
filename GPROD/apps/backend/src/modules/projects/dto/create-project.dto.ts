import { IsString, IsOptional, MaxLength, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Название проекта',
    maxLength: 128,
    example: 'My Project',
  })
  @IsString()
  @MaxLength(128)
  title: string;

  @ApiProperty({
    description: 'Описание проекта',
    required: false,
    example: 'Описание моего проекта',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID владельца (User)',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  ownerId?: number;
}
