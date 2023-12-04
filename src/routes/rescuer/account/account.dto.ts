import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AccountIndexResponse {
  @ApiProperty({
    type: String,
    description: 'The id of the rescuer.',
    example: '5f9d7a3b9d1e8c1b7c9d4401',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'The firstname of the rescuer.',
    example: 'John',
  })
  firstname: string;

  @ApiProperty({
    type: String,
    description: 'The lastname of the rescuer.',
    example: 'Doe',
  })
  lastname: string;

  @ApiProperty({
    type: {
      email: { type: String, required: true, example: 'john@doe.net' },
      verified: {
        type: Boolean,
        required: false,
        default: false,
        example: true,
      },
    },
    description: 'The email of the rescuer.',
  })
  email: {
    email: string;
    verified: boolean;
  };

  @ApiProperty({
    type: {
      phone: { type: String, required: true, example: '0612345678' },
      verified: {
        type: Boolean,
        required: false,
        default: false,
        example: false,
      },
    },
    description: 'The phone of the rescuer.',
  })
  phone: {
    phone: string;
    verified: boolean;
  };
}

export class ChangePhoneRequest {
  @ApiProperty({
    type: String,
    description: 'The new phone of the rescuer.',
    example: '0612345678',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
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

export class VerifyPhoneRequest {
  @ApiProperty({
    type: String,
    description: 'The token to verify the phone of the rescuer.',
    example: '134785',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class ChangePasswordRequest {
  @ApiProperty({
    type: String,
    description: 'The old password of the rescuer.',
    example: 'myOldPassword',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    type: String,
    description: 'The new password of the rescuer.',
    example: 'myNewPassword',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class DeleteRescuerAccountRequest {
  @ApiProperty({
    type: String,
    description: 'The password of the rescuer.',
    example: 'myPassword',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
