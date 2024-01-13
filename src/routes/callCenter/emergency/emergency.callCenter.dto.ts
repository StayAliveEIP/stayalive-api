import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsString, Length } from 'class-validator';

export class EmergencyInfoResponse {
  @ApiProperty({
    type: Types.ObjectId,
    required: true,
    example: '5f9e1d3b3d5b3e1b7c9b4b3e',
  })
  id: Types.ObjectId;
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
}
