import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Length, Min } from 'class-validator';

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
  @IsNotEmpty({ message: 'Vous devez renseigner un niveau' })
  @IsNumber({}, { message: 'Le niveau doit être un nombre' })
  @Min(1, { message: 'Le niveau doit être compris entre 1 et 3' })
  @Min(3, { message: 'Le niveau doit être compris entre 1 et 3' })
  level: number;
}

export class FeedbackQuestionResponse {
  @ApiProperty({
    type: String,
    description: 'The message of the feedback.',
    example: 'I have a suggestion...',
  })
  @IsNotEmpty({ message: 'Vous devez renseigner un message' })
  @Length(1, 5000, {
    message: 'Le message doit contenir entre 1 et 5000 caractères',
  })
  question: string;
}

export class FeedbackAnswerRequest {
  @ApiProperty({
    type: String,
    description: 'The answer of the feedback.',
    example: 'I have a answer...',
  })
  @IsNotEmpty({ message: 'Vous devez renseigner un message' })
  @Length(1, 5000, {
    message: 'Le message doit contenir entre 1 et 5000 caractères',
  })
  answer: string;
}
