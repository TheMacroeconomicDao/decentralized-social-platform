import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP статус ошибки' })
  statusCode: number;

  @ApiProperty({
    example: 'Validation failed',
    description: 'Сообщение об ошибке',
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request', description: 'Тип ошибки' })
  error: string;

  @ApiProperty({
    example: 'USER_NOT_FOUND',
    description: 'Код ошибки',
    required: false,
  })
  code?: string;
}
