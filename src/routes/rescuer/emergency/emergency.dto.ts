import {ApiProperty} from "@nestjs/swagger";

export class EmergencyAcceptDto {
  @ApiProperty({
    type: String,
    description: 'The id of the emergency.',
    example: '5f7a6d3e6f6d7a6d3e6f7a6d',
  })
  id: string;
}
