import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewRequest {
  @ApiProperty({
    type: String,
    description: 'The firstname of the admin.',
    example: 'John',
  })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    type: String,
    description: 'The lastname of the admin.',
    example: 'Doe',
  })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    type: String,
    description: 'The email of the admin.',
    example: 'example@email.net',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class InfoResponse {
  @ApiProperty({
    type: String,
    description: 'The id of the admin in the database.',
    example: '60e6f7b3f5b6f0b3f4f9f6e0',
  })
  id: string;

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

export class DeleteAdminRequest {
  @ApiProperty({
    type: String,
    description: 'The id of the admin to delete.',
    example: '60e6f7b3f5b6f0b3f4f9f6e0',
  })
  @IsNotEmpty()
  id: string;
}

export class DeleteMyAccountRequest {
  @ApiProperty({
    type: String,
    description: 'The password of the admin.',
    example: 'password',
  })
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordRequest {
  @ApiProperty({
    type: String,
    description: 'The old password of the admin.',
    example: 'password',
  })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    type: String,
    description: 'The new password of the admin.',
    example: 'password',
  })
  @IsNotEmpty()
  newPassword: string;
}
