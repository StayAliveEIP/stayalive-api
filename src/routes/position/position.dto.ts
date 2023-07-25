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

export class PositionDeletedDto {
  @ApiProperty({
    type: String,
    description: 'The message of confirmation.',
    example: 'Votre position a été supprimée.',
  })
  message: string;
}
