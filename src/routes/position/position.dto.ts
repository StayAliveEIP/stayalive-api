import { ApiProperty } from '@nestjs/swagger';

export class PositionDto {
  @ApiProperty({
    type: Number,
    description: 'The latitude of the rescuer.',
    example: '-90',
  })
  latitude: number;

  @ApiProperty({
    type: Number,
    description: 'The longitude of the rescuer.',
    example: '90',
  })
  longitude: number;
}

export class PositionWithIdDto {
  @ApiProperty({
    type: String,
    description: 'The id of the rescuer.',
    example: '5f7a6d3e6f6d7a6d3e6f7a6d',
  })
  id: string;

  @ApiProperty({
    type: Number,
    description: 'The latitude of the rescuer.',
    example: '-90',
  })
  latitude: number;

  @ApiProperty({
    type: Number,
    description: 'The longitude of the rescuer.',
    example: '90',
  })
  longitude: number;
}
