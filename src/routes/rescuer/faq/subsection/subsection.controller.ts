import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { SubsectionService } from './subsection.service';
import { SubsectionDto } from './subsection.dto';
import { FaqSubsection } from '../../../../database/faq-subsection.schema';

@ApiTags('Faq')
@Controller('faq/subsection')
export class SubsectionController {
  constructor(private readonly subsectionService: SubsectionService) {}

  @Get(':id')
  @ApiOkResponse({ type: FaqSubsection })
  async subsectionId(@Param() idDto: SubsectionDto) {
    return this.subsectionService.subsectionId(idDto.id);
  }
}
