import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Length, Max, Min } from 'class-validator';

export class ReportBugRequest {
  @ApiProperty({
    type: String,
    description: 'The message of the report.',
    example: 'I found a bug on...',
  })
  @IsNotEmpty({ message: 'Vous devez renseigner un message' })
  @Length(1, 5000, {
    message: 'Le message doit contenir entre 1 et 5000 caractères',
  })
  message: string;

  @ApiProperty({
    type: String,
    description: 'The level of the report, between 1 and 3.',
    example: 1,
  })
  level: string;
}

export class FeedbackAnswerRequest {
  @ApiProperty({
    type: String,
    description: 'The rating of the app, between 1 and 5.',
    example: 4,
  })
  @IsNotEmpty({ message: 'Vous devez renseigner un message' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    type: String,
    description: 'The good points of the app.',
    example: 'I like the...',
  })
  @IsNotEmpty({ message: 'Vous devez renseigner un message' })
  @Length(1, 5000, {
    message: 'Le message doit contenir entre 1 et 5000 caractères',
  })
  goodPoints: string;

  @ApiProperty({
    type: String,
    description: 'The bad points of the app.',
    example: "I don't like the...",
  })
  @IsNotEmpty({ message: 'Vous devez renseigner un message' })
  @Length(1, 5000, {
    message: 'Le message doit contenir entre 1 et 5000 caractères',
  })
  badPoints: string;

  @ApiProperty({
    type: String,
    description: 'The idea and suggestions for the app.',
    example: 'You should add...',
  })
  @IsNotEmpty({ message: 'Vous devez renseigner un message' })
  @Length(1, 5000, {
    message: 'Le message doit contenir entre 1 et 5000 caractères',
  })
  ideaAndSuggestions: string;
}
