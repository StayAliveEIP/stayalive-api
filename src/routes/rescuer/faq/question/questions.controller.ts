import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionDto } from './question.dto';
import { FaqQuestion } from '../../../../database/faq-question.schema';

@ApiTags('Faq')
@Controller('rescuer/faq/question')
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @Get('/')
  @ApiOkResponse({ type: [FaqQuestion] })
  @ApiResponse({ status: 404, description: 'Question introuvable.' })
  async questionId(@Query() param: QuestionDto): Promise<FaqQuestion> {
    return await this.questionService.questionId(param.id);
  }
}
