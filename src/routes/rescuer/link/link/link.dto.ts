import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createLinkDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://www.google.com',
  })
  url: string;

  @ApiProperty({
    example: '2020-11-10T00:00:00.000Z',
  })
  expiresAt: Date | null;
}

export class deleteLinkDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5f9b3b3b9d3b9f1b3b9d3b9f',
  })
  id: string;
}
