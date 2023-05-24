import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class AccountIndexResponse {
  @ApiProperty({
    type: String,
    description: 'The id of the rescuer.',
    example: '5f9d7a3b9d1e8c1b7c9d4401',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'The firstname of the rescuer.',
    example: 'John',
  })
  firstname: string;

  @ApiProperty({
    type: String,
    description: 'The lastname of the rescuer.',
    example: 'Doe',
  })
  lastname: string;

  @ApiProperty({
    type: {
      email: { type: String, required: true, example: 'john@doe.net' },
      verified: {
        type: Boolean,
        required: false,
        default: false,
        example: true,
      },
    },
    description: 'The email of the rescuer.',
  })
  email: {
    email: string;
    verified: boolean;
  };

  @ApiProperty({
    type: {
      phone: { type: String, required: true, example: '0606060606' },
      verified: {
        type: Boolean,
        required: false,
        default: false,
        example: false,
      },
    },
    description: 'The phone of the rescuer.',
  })
  phone: {
    phone: string;
    verified: boolean;
  };
}
