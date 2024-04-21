import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DefibrillatorProposalDto {
  @IsString()
  name: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  location: {
    x: string;
    y: string;
  };
  @IsString()
  @IsNotEmpty()
  imageSrc: string;
}

export class DefibrillatorProposalResponse {
  @ApiProperty({
    example: 'Votre proposition a bien été pris en compte',
    description: 'The message of the response',
  })
  message: string;
}
