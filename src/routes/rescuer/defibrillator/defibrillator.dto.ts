import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DefibrillatorProposalDto {
  @IsString()
  @ApiProperty({
    example: 'Vestiaire Gymnase',
    description: 'The name of the defibrillator',
  })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '12 rue de la rue, 75000 Paris',
    description: 'The address of the defibrillator',
  })
  address: string;
  @ApiProperty({
    type: {
      x: { type: String, required: true, example: '48.8566' },
      y: { type: String, required: true, example: '2.3522' },
    },
    description: 'The location of the defibrillator',
  })
  location: {
    x: string;
    y: string;
  };
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/2w....',
    description: 'The image source of the defibrillator',
  })
  imageSrc: string;
}

export class DefibrillatorProposalResponse {
  @ApiProperty({
    example: 'Votre proposition a bien été pris en compte',
    description: 'The message of the response',
  })
  message: string;
}

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
    example:
      'https://bastos-poc.s3.us-east-2.amazonaws.com/defibrillator/5qc2p',
    description: 'The image link of the defibrillator',
  })
  pictureUrl: string;
  @ApiProperty({
    enum: ['PENDING', 'VALIDATED', 'REFUSED'],
    example: 'VALIDATED',
    description: 'The status of the defibrillator',
  })
  status: DefibrillatorResponse;
}
