import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountInformationAddressResponse {
  @ApiProperty({
    type: String,
    required: true,
    example: '12 rue de la paix',
  })
  street: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Paris',
  })
  city: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '75000',
  })
  zip: string;
}

export class AccountInformationEmailResponse {
  @ApiProperty({
    type: String,
    required: true,
    example: 'john@doe.net',
  })
  email: string;

  @ApiProperty({
    type: Boolean,
    required: true,
    example: false,
  })
  verified: boolean;
}

export class AccountInformationResponse {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Call Center of Paris',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '0123456789',
  })
  phone: string;

  @ApiProperty({
    type: AccountInformationAddressResponse,
    required: true,
  })
  address: AccountInformationAddressResponse;

  @ApiProperty({
    type: AccountInformationEmailResponse,
    required: true,
  })
  email: AccountInformationEmailResponse;
}

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
