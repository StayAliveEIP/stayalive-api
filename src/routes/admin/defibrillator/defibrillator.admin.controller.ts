import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DefibrillatorAdminService } from './defibrillator.admin.service';
import { AdminAuthGuard } from '../../../guards/auth.route.guard';
import {
  DefibrillatorResponse,
  UpdateStatusRequest,
} from './defibrillator.admin.dto';
import { DefibrillatorStatus } from '../../../database/defibrillator.schema';
import { SuccessMessage } from '../../../dto.dto';

@Controller('/admin/defibrillator')
@ApiTags('Defibrillator')
export class DefibrillatorAdminController {
  constructor(private readonly service: DefibrillatorAdminService) {}

  @Get('/all')
  @ApiOperation({
    summary: 'Get all defibrillators',
    description: 'Return all defibrillators.',
  })
  @ApiResponse({
    status: 200,
    description: 'All defibrillators.',
    type: DefibrillatorResponse,
    isArray: true,
  })
  @UseGuards(AdminAuthGuard)
  async all(): Promise<Array<DefibrillatorResponse>> {
    return this.service.getAll();
  }

  @Get('/status')
  @ApiOperation({
    summary: 'Get all defibrillators by a status',
    description: 'Return all defibrillators by a status.',
  })
  @ApiResponse({
    status: 200,
    description: 'All defibrillators by the status provided.',
    type: DefibrillatorResponse,
    isArray: true,
  })
  @ApiQuery({
    name: 'status',
    required: true,
    type: String,
    enum: DefibrillatorStatus,
  })
  @UseGuards(AdminAuthGuard)
  async byStatus(
    @Query('status') status: DefibrillatorStatus,
  ): Promise<Array<DefibrillatorResponse>> {
    return this.service.getByStatus(status);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get a defibrillator by its id',
    description: 'Return a defibrillator by its id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The defibrillator.',
    type: DefibrillatorResponse,
  })
  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
  })
  @UseGuards(AdminAuthGuard)
  async byId(@Param('id') id: string): Promise<DefibrillatorResponse> {
    return this.service.getById(id);
  }

  @Post('/update-status')
  @ApiOperation({
    summary: 'Update the status of a defibrillator',
    description: 'Update the status of a defibrillator.',
  })
  @ApiResponse({
    status: 200,
    description: 'The defibrillator status has been updated.',
    type: SuccessMessage,
  })
  @UseGuards(AdminAuthGuard)
  async updateStatus(
    @Body() body: UpdateStatusRequest,
  ): Promise<SuccessMessage> {
    return this.service.updateStatus(body.id, body.status);
  }
}
