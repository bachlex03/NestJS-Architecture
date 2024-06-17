import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'lov3rinve146@gmail.com' })
  email: string;

  @ApiProperty({ example: 'lov3rinve146@' })
  password: string;

  @ApiProperty({ example: 'Ba' })
  firstName: string;

  @ApiProperty({ example: 'Le' })
  lastName: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsPhoneNumber('VN')
  phoneNumber?: string;
}
