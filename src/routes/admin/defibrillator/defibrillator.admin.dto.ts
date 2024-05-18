import { ApiProperty } from '@nestjs/swagger';
import { DefibrillatorStatus } from '../../../database/defibrillator.schema';

export class DefibrillatorResponse {
  @ApiProperty({
    example: '5f7a6d3e6f6d7a6d3e6f7a6d',
    description: 'The id of the defibrillator',
  })
  _id: string;
  @ApiProperty({
    example: 'Vestiaire Gymnase',
    description: 'The name of the defibrillator',
  })
  name: string;
  @ApiProperty({
    example: '12 rue de la rue, 75000 Paris',
    description: 'The address of the defibrillator',
  })
  address: string;
  @ApiProperty({
    example: 'https://www.google.com/image.png',
    description: 'The image link of the defibrillator',
  })
  pictureUrl: string;
  @ApiProperty({
    example: 'VALIDATED',
    description: 'The status of the defibrillator',
  })
  status: string;
}

export class UpdateStatusRequest {
  @ApiProperty({
    example: '5f7a6d3e6f6d7a6d3e6f7a6d',
    description: 'The id of the defibrillator',
  })
  id: string;

  @ApiProperty({
    example: DefibrillatorStatus.VALIDATED,
    description: 'The status of the defibrillator',
    enum: DefibrillatorStatus,
  })
  status: DefibrillatorStatus;
}
