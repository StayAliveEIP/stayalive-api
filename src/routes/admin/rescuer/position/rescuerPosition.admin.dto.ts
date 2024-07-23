import { ApiProperty } from '@nestjs/swagger';

export class RescuerPositionAdminResponse {
  @ApiProperty({
    type: String,
    required: true,
    example: '123.123',
  })
  lat: number;

  @ApiProperty({
    type: String,
    required: true,
    example: '123.123',
  })
  long: number;
}
