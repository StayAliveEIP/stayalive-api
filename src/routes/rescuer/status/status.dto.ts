import { IsNotEmpty, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class StatusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'NOT_AVAILABLE | AVAILABLE',
  })
  status: string;
}
