import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNameRequest {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Call Center of Paris',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateAddressRequest {
  @ApiProperty({
    type: String,
    required: true,
    example: '12 rue de la paix, Paris',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Paris',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '75000',
  })
  @IsString()
  @IsNotEmpty()
  zip: string;
}
