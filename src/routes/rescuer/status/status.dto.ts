import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Status {
  AVAILABLE = 'AVAILABLE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export class StatusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: Status.AVAILABLE,
  })
  status: Status;
}
