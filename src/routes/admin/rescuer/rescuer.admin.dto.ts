import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { string } from 'joi';

export class SuspendRescuerAdminRequest {
  @IsString({ message: "L'id du sauveteur doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "L'id du sauveteur est obligatoire" })
  @IsMongoId({ message: "L'id du sauveteur doit être un identifiant MongoDB" })
  @ApiProperty({
    type: String,
    description: "L'id du sauveteur",
    example: '60b8a3d7e4e0a40015f1f5f2',
  })
  rescuerId: string;

  @IsString({ message: 'La raison doit être une chaîne de caractères' })
  @Length(1, 100, {
    message: 'La raison doit être comprise entre 1 et 100 caractères',
  })
  @ApiProperty({
    type: String,
    description: 'La raison de la suspension',
    example: 'Comportement inapproprié',
  })
  reason: string;
}
