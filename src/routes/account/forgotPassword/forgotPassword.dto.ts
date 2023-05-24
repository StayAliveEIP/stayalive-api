import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordLinkDTO {
  @ApiProperty({
    description: 'The email of the account',
    type: String,
    example: 'john@doe.net',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordLinkResponse {
  @ApiProperty({
    description: 'The message of confirmation',
    type: String,
    example:
      'Un mail contenant un lien pour réinitialiser votre mot de passe vous a été envoyé.',
  })
  @IsEmail()
  @IsNotEmpty()
  message: string;
}

export class ForgotPasswordResetDTO {
  @ApiProperty({
    description: 'The token used to reset the password',
    type: String,
    example: '68kbjfsd5UIkbjfsd5UIkbjfsd5UIkbjfsd5UIkbjfsd5UIkbjfsd5UI',
  })
  @IsNotEmpty({
    message: 'Le token est obligatoire.',
  })
  token: string;

  @ApiProperty({
    description: 'The new password',
    type: String,
    example: 'myNewPassword',
  })
  @IsNotEmpty({
    message: 'Le mot de passe est obligatoire.',
  })
  password: string;
}

export class ForgotPasswordResetResponse {
  @ApiProperty({
    description: 'The message of confirmation',
    type: String,
    example: 'Votre mot de passe a été réinitialisé.',
  })
  @IsNotEmpty({
    message: 'Le message est obligatoire.',
  })
  message: string;
}
