import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class EmergencyAcceptDto {
  @ApiProperty({
    type: String,
    description: 'The id of the emergency.',
    example: '5f7a6d3e6f6d7a6d3e6f7a6d',
  })
  id: string;
}

export class EmergencyHistoryResponse {
  @ApiProperty({
    type: String,
    description: 'The id of the emergency.',
    example: '5f7a6d3e6f6d7a6d3e6f7a6d',
  })
  id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'The info of the emergency.',
    example: 'string',
  })
  info: string;

  @ApiProperty({
    type: String,
    description: 'The address of the emergency.',
    example: '17 rue des Lilas , Paris',
  })
  address: string;

  @ApiProperty({
    type: String,
    description: 'The status of the emergency.',
    example: 'ASSIGNED',
  })
  status: string;
}
