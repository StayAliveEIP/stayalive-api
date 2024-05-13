import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class EmergencyInfoResponse {
  @ApiProperty({
    type: Types.ObjectId,
    required: true,
    example: '5f9e1d3b3d5b3e1b7c9b4b3e',
  })
  id: Types.ObjectId;

  @ApiProperty({
    type: String,
    required: true,
    example: 'PENDING',
  })
  status: string;

  @ApiProperty({
    type: Object,
    required: true,
    example:
      {
        id: '5f9e1d3b3d5b3e1b7c9b4b3e',
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
      } || null,
    description: 'The rescuer assigned to the emergency WARNING: can be null',
  })
  rescuerAssigned: {
    id: Types.ObjectId;
    firstname: string;
    lastname: string;
    phone: string;
  };

  @ApiProperty({
    type: String,
    required: true,
    example: '12 rue de la paix, Paris',
  })
  address: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The info of the emergency (details)',
    example: 'Je suis en feu',
  })
  info: string;
}

export class CreateNewEmergencyRequestPosition {
  @ApiProperty({
    type: String,
    required: true,
    example: '123.123',
  })
  lat: number;

  @ApiProperty({
    type: String,
    required: true,
    example: '123.123',
  })
  long: number;
}

export class CreateNewEmergencyRequest {
  @ApiProperty({
    type: String,
    required: true,
    description:
      'The info of the emergency, this information will be shown to the rescuer',
  })
  @IsString()
  @Length(1, 100)
  info: string;

  @ApiProperty({
    type: String,
    required: true,
    description:
      'The position of the emergency, this information will be shown to the rescuer',
    example: {
      lat: '123.123',
      long: '123.123',
    },
  })
  position: CreateNewEmergencyRequestPosition;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    description:
      'The address of the emergency, this information will be shown to the rescuer',
    example: '13 rue de la paix, Paris',
  })
  address: string;
}
