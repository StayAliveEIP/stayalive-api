import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../guards/auth.route.guard';
import { BugReportAdminResponse } from './report.admin.dto';
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

  @Patch('/bug/:id')
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
}
