import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMagicLinkRequest {
  @ApiProperty({
    type: String,
    description: 'The email of the rescuer.',
    example: 'john@doe.net',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginDTO {
  @IsNotEmpty({ message: "L'email est obligatoire." })
  @IsString({ message: "L'email doit être une chaine de caractère." })
  @MinLength(4, {
    message: "L'email doit contenir au moins 4 caractères.",
  })
  @IsEmail({}, { message: "L'email doit être une adresse email valide." })
  @MaxLength(100, {
    message: "L'email doit contenir au plus 100 caractères.",
  })
  @ApiProperty({
    example: 'joh@doe.net',
    description: 'The email of the rescuer',
  })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @IsString({
    message: 'Le mot de passe doit être une chaine de caractère.',
  })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  @MaxLength(100, {
    message: 'Le mot de passe doit contenir au plus 100 caractères.',
  })
  @ApiProperty({
    example: 'myPassword',
    description: 'The password of the rescuer',
  })
  password: string;
}

export class LoginResponse {
  @ApiProperty({
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The token of the rescuer',
  })
  accessToken: string;
}

export class RegisterResponse {
  @ApiProperty({
    example:
      'Votre compte à bien été enregistré, vous pouvez maintenant vous connecter !',
    description: 'The message of the response',
  })
  message: string;
}

export class RegisterDTO {
  @IsNotEmpty({ message: "L'email est obligatoire." })
  @IsString({ message: "L'email doit être une chaine de caractère." })
  @MinLength(4, {
    message: "L'email doit contenir au moins 4 caractères.",
  })
  @IsEmail({}, { message: "L'email doit être une adresse email valide." })
  @MaxLength(320, {
    message: "L'email doit contenir au plus 320 caractères.",
  })
  @ApiProperty({
    example: 'joh@doe.net',
    description: 'The email of the rescuer',
  })
  email: string;

  @IsNotEmpty({ message: 'Le prénom est obligatoire.' })
  @IsString({ message: 'Le prénom doit être une chaine de caractère.' })
  @MinLength(4, {
    message: 'Le prénom doit contenir au moins 4 caractères.',
  })
  @MaxLength(30, {
    message: 'Le prénom doit contenir au plus 30 caractères.',
  })
  @ApiProperty({
    example: 'John',
    description: 'The firstname of the rescuer',
  })
  firstname: string;

  @IsNotEmpty({ message: 'Le nom de famille est obligatoire.' })
  @IsString({ message: 'Le nom de famille doit être une chaine de caractère.' })
  @MinLength(4, {
    message: 'Le nom de famille doit contenir au moins 4 caractères.',
  })
  @MaxLength(30, {
    message: 'Le nom de famille doit contenir au plus 30 caractères.',
  })
  @ApiProperty({
    example: 'Doe',
    description: 'The lastname of the rescuer',
  })
  lastname: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @IsString({
    message: 'Le mot de passe doit être une chaine de caractère.',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty({
    example: 'myPassword',
    description: 'The password of the rescuer',
  })
  password: string;

  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire.' })
  @IsString({
    message: 'Le numéro de téléphone doit être une chaine de caractère.',
  })
  @IsPhoneNumber('FR', {
    message: 'Le numéro de téléphone doit être un numéro de téléphone valide.',
  })
  @ApiProperty({
    example: '0606060606',
    description: 'The phone of the rescuer in FR format',
  })
  phone: string;
}
