import { ApiProperty } from '@nestjs/swagger';

export class BugReportUserAdminResponse {
  @ApiProperty({
    type: String,
    description: 'The id of the user that created the report.',
    example: '60f1e9f7d6f7f5001f8c9c4b',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The firstname of the user that created the report.',
    example: 'John',
  })
  firstname: string;

  @ApiProperty({
    type: String,
    description: 'The lastname of the user that created the report.',
    example: 'Doe',
  })
  lastname: string;

  @ApiProperty({
    type: String,
    description: 'The email of the user that created the report.',
    example: 'john@doe.net',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'The profile picture url of the user that created the report.',
    example: 'https://s3.amazonaws.com/...',
    nullable: true,
  })
  profilePictureUrl: string | null;
}

export class BugReportAdminResponse {
  @ApiProperty({
    type: String,
    description: 'The id of the report.',
    example: '60f1e9f7d6f7f5001f8c9c4b',
  })
  id: string;

  @ApiProperty({
    type: BugReportUserAdminResponse,
    description: 'The user that created the report.',
  })
  user: BugReportUserAdminResponse;

  @ApiProperty({
    type: String,
    description: 'The message of the report.',
    example: 'I found a bug on...',
  })
  message: string;

  @ApiProperty({
    type: Number,
    description: 'The level of the report, between 1 and 3.',
    example: 1,
  })
  level: number;

  @ApiProperty({
    type: Boolean,
    description: 'The status of the report.',
  })
  isResolved: boolean;

  @ApiProperty({
    type: String,
    description: 'The picture url of the report.',
    example: ['https://s3.amazonaws.com/...'],
    isArray: true,
  })
  pictureUrls: string[];

  @ApiProperty({
    type: String,
    description: 'The date of the report.',
    example: '2021-07-16T09:00:00.000Z',
  })
  createdAt: string;
}

// Feedback

export class FeedbackReportUserAdminResponse {
  @ApiProperty({
    type: String,
    description: 'The id of the user that created the feedback.',
    example: '60f1e9f7d6f7f5001f8c9c4b',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The firstname of the user that created the feedback.',
    example: 'John',
  })
  firstname: string;

  @ApiProperty({
    type: String,
    description: 'The lastname of the user that created the feedback.',
    example: 'Doe',
  })
  lastname: string;

  @ApiProperty({
    type: String,
    description: 'The email of the user that created the feedback.',
    example: 'john@doe.net',
  })
  email: string;

  @ApiProperty({
    type: String,
    description:
      'The profile picture url of the user that created the feedback.',
    example: 'https://s3.amazonaws.com/...',
    nullable: true,
  })
  profilePictureUrl: string | null;
}

export class FeedbackReportAdminResponse {
  @ApiProperty({
    type: String,
    description: 'The id of the feedback.',
    example: '60f1e9f7d6f7f5001f8c9c4b',
  })
  id: string;

  @ApiProperty({
    type: FeedbackReportUserAdminResponse,
    description: 'The user that created the feedback.',
  })
  user: FeedbackReportUserAdminResponse;

  @ApiProperty({
    type: Number,
    description: 'The rating of the feedback, between 1 and 5.',
    example: 4,
  })
  rating: number;

  @ApiProperty({
    type: String,
    description: 'The good points of the feedback.',
    example: 'I like the...',
  })
  goodPoints: string;

  @ApiProperty({
    type: String,
    description: 'The bad points of the feedback.',
    example: "I don't like the...",
  })
  badPoints: string;

  @ApiProperty({
    type: String,
    description: 'The idea and suggestions for the feedback.',
    example: 'You should add...',
  })
  ideaAndSuggestions: string;

  @ApiProperty({
    type: String,
    description: 'The date of the feedback.',
    example: '2021-07-16T09:00:00.000Z',
  })
  createdAt: string;
}
