import { ApiProperty } from '@nestjs/swagger';

export class SuccessMessage {
  @ApiProperty({
    type: String,
    required: true,
    example: 'You request was successfully performed !',
  })
  message: string;
}
