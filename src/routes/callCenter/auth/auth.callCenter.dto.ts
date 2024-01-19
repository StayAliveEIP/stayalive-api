import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginCallCenterRequest {
  @ApiProperty({
    type: String,
    description: 'The email of the call center.',
    example: 'jophn@doe.net',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'The password of the call center.',
    example: 'myPassword123',
  })
  password: string;
}

export class LoginCallCenterResponse {
  @ApiProperty({
    type: String,
    description: 'The token of the call center.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ik5vbmUiLCJpYXQiOjE2MjU2NjMxNjksImV4cCI6MTYyNTY2NjM2OX0.6Ym0rQy8q1o9Yz3XsV4YKk1bDn4N1q4w6d8LgX8qj0A',
  })
  accessToken: string;
}
