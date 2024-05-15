import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordRequest {
  @ApiProperty({
    type: String,
    description: 'The email of the call center.',
    example: 'john@doe.net',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordRequest {
  @ApiProperty({
    type: String,
    description: 'The new password of the call center.',
    example: 'myNewPassword123',
  })
  password: string;

  @ApiProperty({
    type: String,
    description: 'The token of the call center.',
    example: '167-789',
  })
  token: string;
}
