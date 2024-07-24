import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../../../guards/auth.route.guard';
import { SuccessMessage } from '../../../dto.dto';
import { RescuerAdminService } from './rescuer.admin.service';
import { SuspendRescuerAdminRequest } from './rescuer.admin.dto';

@Controller('/admin/rescuer')
@ApiTags('Rescuer')
@ApiBearerAuth()
export class RescuerAdminController {
  constructor(private readonly service: RescuerAdminService) {}

  @Get('/suspend/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Suspend a rescuer',
    description: 'Mark a rescuer as suspended.',
  })
  @ApiResponse({
    status: 200,
    description: 'The rescuer was suspended.',
    type: SuccessMessage,
  })
  @ApiBody({ type: SuspendRescuerAdminRequest })
  async suspendRescuer(
    @Body() body: SuspendRescuerAdminRequest,
  ): Promise<SuccessMessage> {
    return this.service.suspendRescuer(body);
  }

  @Get('/unsuspend/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Unsuspend a rescuer',
    description: 'Mark a rescuer as unsuspended.',
  })
  @ApiResponse({
    status: 200,
    description: 'The rescuer was unsuspended.',
    type: SuccessMessage,
  })
  async unsuspendRescuer(@Param('id') id: string): Promise<SuccessMessage> {
    return this.service.unsuspendRescuer(id);
  }
}
