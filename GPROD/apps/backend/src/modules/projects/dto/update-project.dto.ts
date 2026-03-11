import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto.js';
import { IsOptional } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({
    description: 'Новое название проекта',
    required: false,
    example: 'New Project Title',
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Новое описание проекта',
    required: false,
    example: 'Новое описание',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID нового владельца',
    required: false,
    example: 2,
  })
  @IsOptional()
  ownerId?: number;
}
