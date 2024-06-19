import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionDto } from './question.dto';
import { FaqQuestion } from '../../../../database/faq-question.schema';

@ApiTags('Faq')
@Controller('faq/question')
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @Get(':id')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '5f9d2c1b9d3f2b1f3c9b8b1e' },
        question: { type: 'string', example: 'Comment créer un compte ?' },
        answer: {
          type: 'string',
          example:
            '<p>Pour créer un compte, il vous suffit de cliquer sur le bouton "S\'inscrire" en haut à droite de la page.</p>',
        },
        subsection: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '5f9d2c1b9d3f2b1f3c9b8b1e' },
            title: { type: 'string', example: 'Comment créer un compte ?' },
            description: {
              type: 'string',
              example:
                'Pour créer un compte, il vous suffit de cliquer sur le bouton "S\'inscrire" en haut à droite de la page.',
            },
            section: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '5f9d2c1b9d3f2b1f3c9b8b1e' },
                title: { type: 'string', example: 'Titre de la section' },
                description: {
                  type: 'string',
                  example: 'Description de la section ',
                },
              },
            },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string', example: '5f9d2c1b9d3f2b1f3c9b8b1e' },
                  question: {
                    type: 'string',
                    example: 'Comment créer un compte ?',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Question introuvable.' })
  async questionId(@Param() param: QuestionDto): Promise<FaqQuestion> {
    return await this.questionService.questionId(param.id, null);
  }
}
