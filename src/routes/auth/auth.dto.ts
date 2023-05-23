import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  password: string;
}

export class RegisterDTO {
  @IsNotEmpty({ message: "L'email est obligatoire." })
  @IsString({ message: "L'email doit être une chaine de caractère." })
  @MinLength(4, {
    message: "L'email doit contenir au moins 4 caractères.",
  })
  @IsEmail({}, { message: "L'email doit être une adresse email valide." })
  @MaxLength(100, {
    message: "L'email doit contenir au plus 100 caractères.",
  })
  email: string;

  @IsNotEmpty({ message: 'Le prénom est obligatoire.' })
  @IsString({ message: 'Le prénom doit être une chaine de caractère.' })
  @MinLength(4, {
    message: 'Le prénom doit contenir au moins 4 caractères.',
  })
  @MaxLength(100, {
    message: 'Le prénom doit contenir au plus 100 caractères.',
  })
  firstname: string;

  @IsNotEmpty({ message: 'Le nom de famille est obligatoire.' })
  @IsString({ message: 'Le nom de famille doit être une chaine de caractère.' })
  @MinLength(4, {
    message: 'Le nom de famille doit contenir au moins 4 caractères.',
  })
  @MaxLength(100, {
    message: 'Le nom de famille doit contenir au plus 100 caractères.',
  })
  lastname: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @IsString({
    message: 'Le mot de passe doit être une chaine de caractère.',
  })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  @MaxLength(20, {
    message: 'Le mot de passe doit contenir au plus 20 caractères.',
  })
  password: string;

  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire.' })
  @IsString({
    message: 'Le numéro de téléphone doit être une chaine de caractère.',
  })
  @IsPhoneNumber('FR', {
    message: 'Le numéro de téléphone doit être un numéro de téléphone valide.',
  })
  phone: string;
}
