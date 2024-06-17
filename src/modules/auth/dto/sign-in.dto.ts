import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'lov3rinve146@gmail.com' })
  email: string;

  @ApiProperty({ example: 'lov3rinve146@' })
  password: string;
}
