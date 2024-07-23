import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RescuerPositionAdminService } from './rescuerPosition.admin.service';
import { RescuerPositionAdminResponse } from './rescuerPosition.admin.dto';
import { async } from 'rxjs';
import { AdminAuthGuard } from '../../../../guards/auth.route.guard';

@Controller('/admin/rescuer/position')
@ApiTags('Rescuer Position')
@ApiBearerAuth()
export class RescuerPositionAdminController {
  constructor(private readonly service: RescuerPositionAdminService) {}

  @Get('/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({
    summary: 'Get the position of a rescuer',
    description: 'Get the position of a rescuer.',
  })
  @ApiResponse({
    status: 200,
    description: 'The position of the rescuer.',
    type: RescuerPositionAdminResponse,
  })
  async getRescuerPosition(
    @Param('id') id: string,
  ): Promise<RescuerPositionAdminResponse> {
    return this.service.getRescuerPosition(id);
  }
}
