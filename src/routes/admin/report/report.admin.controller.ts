import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../guards/auth.route.guard';
import {
  BugReportAdminResponse,
  FeedbackReportAdminResponse,
} from './report.admin.dto';
import { ReportAdminService } from './report.admin.service';
import { SuccessMessage } from '../../../dto.dto';

@ApiBearerAuth()
@ApiTags('Report')
@Controller('/admin/report')
export class ReportAdminController {
  constructor(private readonly service: ReportAdminService) {}

  @Get('/bug')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Get all bug reports',
    description: 'Get all bug reports sent by users.',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of bug reports',
    type: BugReportAdminResponse,
    isArray: true,
  })
  async reportBug(): Promise<BugReportAdminResponse[]> {
    return this.service.getBug();
  }

  @Get('/bug/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Get bug report',
    description: 'Get a bug report sent by a user.',
  })
  @ApiResponse({
    status: 200,
    description: 'The bug report',
    type: BugReportAdminResponse,
  })
  async getBug(@Param('id') id: string): Promise<BugReportAdminResponse> {
    return this.service.getBugById(id);
  }

  @Patch('/bug/:id/status')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Change status of a bug report',
    description: 'Mark a bug report as resolved or unresolved.',
  })
  @ApiResponse({
    status: 200,
    type: SuccessMessage,
    description: 'The bug report has been marked as resolved or unresolved.',
  })
  async resolveBug(@Param('id') id: string): Promise<SuccessMessage> {
    return this.service.resolveBug(id);
  }

  @Patch('/bug/:id/level')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Change level of a bug report',
    description: 'Change the level of a bug report.',
  })
  @ApiResponse({
    status: 200,
    type: SuccessMessage,
    description: 'The level of the bug report has been changed.',
  })
  @ApiQuery({
    name: 'level',
    type: Number,
    description: 'The new level of the bug report, between 1 and 3.',
  })
  async changeLevel(
    @Param('id') id: string,
    @Query('level') level: string,
  ): Promise<SuccessMessage> {
    return this.service.changeLevel(id, level);
  }

  @Delete('/bug/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Delete a bug report',
    description: 'Delete a bug report sent by a user.',
  })
  @ApiResponse({
    status: 200,
    type: SuccessMessage,
    description: 'The bug report has been deleted',
  })
  async deleteBug(@Param('id') id: string): Promise<SuccessMessage> {
    return this.service.deleteBug(id);
  }

  @Get('/feedback')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Get all feedback',
    description: 'Get all feedback sent by users.',
  })
  @ApiResponse({
    status: 200,
    type: FeedbackReportAdminResponse,
    isArray: true,
    description: 'The feedback has been sent',
  })
  async getFeedbacks(): Promise<FeedbackReportAdminResponse[]> {
    return this.service.getFeedbacks();
  }

  @Get('/feedback/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Get feedback',
    description: 'Get feedback sent by users.',
  })
  @ApiResponse({
    status: 200,
    type: FeedbackReportAdminResponse,
    description: 'The feedback has been sent',
  })
  async getFeedback(
    @Param('id') id: string,
  ): Promise<FeedbackReportAdminResponse> {
    return this.service.getFeedback(id);
  }
}
