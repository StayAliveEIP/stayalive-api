import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { SubsectionService } from './subsection.service';
import { SubsectionDto } from './subsection.dto';
import { FaqSubsection } from '../../../../database/faq-subsection.schema';

@ApiTags('Faq')
@Controller('rescuer/faq/subsection')
export class SubsectionController {
  constructor(private readonly subsectionService: SubsectionService) {}

  @Get('/')
  @ApiOkResponse({ type: FaqSubsection })
  async subsectionId(@Query() idDto: SubsectionDto) {
    return this.subsectionService.subsectionId(idDto.id);
  }
}
