import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewCallCenterAddressRequest {
  @ApiProperty({
    type: String,
    description: 'The street of the call center.',
    example: 'My Street',
  })
  @IsString()
  street: string;

  @ApiProperty({
    type: String,
    description: 'The city of the call center.',
    example: 'My City',
  })
  @IsString()
  city: string;

  @ApiProperty({
    type: String,
    description: 'The zip of the call center.',
    example: '12345',
  })
  @IsString()
  zip: string;
}

export class NewCallCenterRequest {
  @ApiProperty({
    type: String,
    description: 'The name of the call center.',
    example: 'My Call Center 123',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'The email of the call center.',
    example: 'call@center.net',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'The phone of the call center.',
    example: '1234567890',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    type: Object,
    description: 'The street of the call center.',
    example: {
      street: 'My Street',
      city: 'My City',
      zip: '12345',
    },
  })
  address: NewCallCenterAddressRequest;
}

export class DeleteCallCenterRequest {
  @ApiProperty({
    type: String,
    description: 'The id of the call center.',
    example: '60e6f7b3f5b6f0b3f4f9f6e0',
  })
  @IsString()
  id: string;
}

// Call center info

export class CallCenterInfoEmailDto {
  @ApiProperty({
    type: String,
    description: 'The email of the call center.',
    example: 'call@center.net',
  })
  email: string;

  @ApiProperty({
    type: Boolean,
    description: 'To know if the email is verified.',
    example: true,
  })
  verified: boolean;

  @ApiProperty({
    type: String,
    description: 'The date of the last code sent.',
    example: new Date(),
    nullable: true,
  })
  lastCodeSent: Date | null;
}

export class CallCenterAddressDto {
  @ApiProperty({
    type: String,
    description: 'The street of the call center.',
    example: 'My Street',
  })
  street: string;

  @ApiProperty({
    type: String,
    description: 'The city of the call center.',
    example: 'My City',
  })
  city: string;

  @ApiProperty({
    type: String,
    description: 'The zip of the call center.',
    example: '12345',
  })
  zip: string;
}

export class CallCenterInfoDto {
  @ApiProperty({
    type: String,
    description: 'The id of the call center.',
    example: '60e6f7b3f5b6f0b3f4f9f6e0',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the call center.',
    example: 'My Call Center 123',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The phone of the call center.',
    example: '1234567890',
  })
  phone: string;

  @ApiProperty({
    type: CallCenterInfoEmailDto,
    description: 'The email of the call center.',
    example: {
      email: 'call@center.net',
      verified: true,
      lastCodeSent: new Date(),
    },
  })
  email: CallCenterInfoEmailDto;

  @ApiProperty({
    type: CallCenterAddressDto,
    description: 'The address of the call center.',
    example: {
      street: 'My Street',
      city: 'My City',
      zip: '12345',
    },
  })
  address: CallCenterAddressDto;
}

export class PatchCallCenterRequest {
  @ApiProperty({
    type: String,
    description: 'The id of the call center.',
    example: '60e6f7b3f5b6f0b3f4f9f6e0',
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the call center.',
    example: 'My Call Center 123',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'The email of the call center.',
    example: 'call@center.net',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'The phone of the call center.',
    example: '1234567890',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    type: Object,
    description: 'The street of the call center.',
    example: {
      street: 'My Street',
      city: 'My City',
      zip: '12345',
    },
  })
  address: NewCallCenterAddressRequest;
}
