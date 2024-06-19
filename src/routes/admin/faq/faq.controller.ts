import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../../../guards/auth.route.guard';
import {
  HelpIdDto,
  QuestionDto,
  SearchDto,
  SectionDto,
  SectionPostDto,
  SubsectionDto,
} from './faq.dto';
import { FaqAdminService } from './faq.service';

@Controller('faq')
export class FaqAdminController {
  constructor(private readonly helpService: FaqAdminService) {}

  @UseGuards(AdminAuthGuard)
  @Post('section')
  async postSection(@Body() body: SectionPostDto) {
    return await this.helpService.postSection(body.title, body.description);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('section')
  async deleteSection(@Body() body: HelpIdDto) {
    return await this.helpService.deleteSection(body.id);
  }

  @UseGuards(AdminAuthGuard)
  @Put('section')
  async putSection(@Body() body: SectionDto) {
    return await this.helpService.putSection(
      body._id,
      body.title,
      body.description,
    );
  }

  @UseGuards(AdminAuthGuard)
  @Post('subsection')
  async postSubsection(@Body() body: SubsectionDto) {
    return await this.helpService.postSubsection(
      body.section,
      body.title,
      body.description,
    );
  }

  @UseGuards(AdminAuthGuard)
  @Put('subsection')
  async putSubsection(@Body() body: SubsectionDto) {
    return await this.helpService.putSubsection(
      body.section,
      body.title,
      body.description,
    );
  }

  @UseGuards(AdminAuthGuard)
  @Delete('subsection')
  async deleteSubsection(@Param() body: HelpIdDto) {
    return await this.helpService.deleteSubsection(body.id);
  }

  @UseGuards(AdminAuthGuard)
  @Post('question')
  async postQuestion(@Body() body: QuestionDto) {
    return await this.helpService.postQuestion(
      body.subsection,
      body.question,
      body.answer,
      body.author,
    );
  }

  @UseGuards(AdminAuthGuard)
  @Put('question')
  async putQuestion(@Body() body: QuestionDto) {
    return await this.helpService.putQuestion(
      body.subsection,
      body.question,
      body.answer,
    );
  }

  @UseGuards(AdminAuthGuard)
  @Delete('question')
  async deleteQuestion(@Param() body: HelpIdDto) {
    return await this.helpService.deleteQuestion(body.id);
  }

  @UseGuards(AdminAuthGuard)
  @Get('details-sections')
  async getDetailsSections() {
    return await this.helpService.getSectionDetails();
  }

  @UseGuards(AdminAuthGuard)
  @Post('search')
  async postDetailsSections(@Body() body: SearchDto) {
    return await this.helpService.postSearch(body.search);
  }
}
