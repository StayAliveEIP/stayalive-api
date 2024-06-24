import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
    description: 'The url of the profile picture of the admin.',
    example: 'https://s3.amazonaws.com/...',
    nullable: true,
  })
  profilePictureUrl: string | null;

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

export class UpdateAdminAccountRequest {
  @ApiProperty({
    type: String,
    description: 'The id of the admin to update.',
    example: '60e6f7b3f5b6f0b3f4f9f6e0',
  })
  id: string;

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
}

export class ChangeEmailRequest {
  @ApiProperty({
    type: String,
    description: 'The new email of the rescuer.',
    example: 'newemail@email.net',
  })
  @IsEmail()
  email: string;
}

export class VerifyEmailRequest {
  @ApiProperty({
    type: String,
    description: 'The token to verify the email of the rescuer.',
    example: 'a1b2c3d4e5f6g7h8i9j0',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
