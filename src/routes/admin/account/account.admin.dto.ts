import { ApiProperty } from '@nestjs/swagger';

export class NewRequest {
  @ApiProperty({
    type: String,
    description: 'The firstname of the admin.',
    example: 'John',
  })
  firstname: string;

  @ApiProperty({
    type: String,
    description: 'The lastname of the admin.',
    example: 'Doe',
  })
  lastname: string;

  @ApiProperty({
    type: String,
    description: 'The email of the admin.',
    example: 'example@email.net',
  })
  email: string;
}

export class InfoResponse {
  @ApiProperty({
    type: String,
    description: 'The firstname of the admin.',
    example: 'John',
  })
  firstname: string;

  @ApiProperty({
    type: String,
    description: 'The lastname of the admin.',
    example: 'Doe',
  })
  lastname: string;

  @ApiProperty({
    type: String,
    description: 'The email of the admin.',
    example: 'example@email.net',
  })
  email: string;

  @ApiProperty({
    type: Boolean,
    description: 'To know if the email is verified.',
    example: true,
  })
  emailVerified: boolean;
}
