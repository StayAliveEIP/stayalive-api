import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SectionDto {
  @ApiProperty({ example: '63d3b81ff8f37f5c3919280c' })
  @IsString()
  @Length(24, 24, { message: "L'id doit être de 24 caractères." })
  id: string;
}
