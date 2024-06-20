import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SectionService } from './section.service';
import { FaqSection } from '../../../../database/faq-section.schema';
import { SectionDto } from './section.dto';

@ApiTags('Faq')
@Controller('rescuer/faq/section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get('/all')
  @ApiOkResponse({ type: [FaqSection] })
  async section() {
    return await this.sectionService.section();
  }

  @Get('/')
  @ApiResponse({ status: 404, description: 'Section introuvable.' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '5f9d2c1b9d3f2b1f3c9b8b1e' },
        title: { type: 'string', example: 'Comment créer un compte ?' },
        description: {
          type: 'string',
          example:
            'Pour créer un compte, il vous suffit de cliquer sur le bouton "S\'inscrire" en haut à droite de la page.',
        },
        subsections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '5f9d2c1b9d3f2b1f3c9b8b1e' },
              title: { type: 'string', example: 'Comment créer un compte ?' },
              description: {
                type: 'string',
                example: '',
              },
            },
          },
        },
      },
    },
  })
  async sectionId(@Query() idDto: SectionDto) {
    return await this.sectionService.sectionId(idDto.id);
  }
}
