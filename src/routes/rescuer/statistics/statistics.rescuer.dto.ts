import { ApiProperty } from '@nestjs/swagger';

export enum SuccessType {
  EMERGENCY = 'EMERGENCY',
  CONNECTION_TIME = 'CONNECTION_TIME',
}

export class SuccessElement {
  @ApiProperty({
    example: 'You performed a successful rescue!',
    description: 'The name of success',
  })
  name: string;

  @ApiProperty({
    example: SuccessType.EMERGENCY,
    description: 'The type of success',
  })
  type: SuccessType;

  @ApiProperty({
    example: true,
    description: 'If the success was performed or not',
  })
  isSuccessful: boolean;
}

export class AvailabilityDay {
  @ApiProperty({
    example: new Date(),
    description: 'The day of the availability',
  })
  date: Date;

  @ApiProperty({
    example: 1686,
    description: 'The number of seconds the rescuer is available',
  })
  timeInSec: number;
}
