import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAdminRequest {
  @ApiProperty({
    type: String,
    description: 'The email of the admin.',
    example: 'jophn@doe.net',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'The password of the admin.',
    example: 'myPassword123',
  })
  @IsNotEmpty()
  password: string;
}

export class LoginAdminResponse {
  @ApiProperty({
    type: String,
    description: 'The token of the admin.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ik5vbmUiLCJpYXQiOjE2MjU2NjMxNjksImV4cCI6MTYyNTY2NjM2OX0.6Ym0rQy8q1o9Yz3XsV4YKk1bDn4N1q4w6d8LgX8qj0A',
  })
  token: string;
}
