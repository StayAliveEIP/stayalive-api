import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { CallCenterAdminService } from './callCenter.admin.service';
import {
  CallCenterInfoDto,
  DeleteCallCenterRequest,
  NewCallCenterRequest,
} from './callCenter.admin.dto';
import { SuccessMessage } from '../../../dto.dto';

@Controller('/admin/call-center')
@ApiTags('Call Center')
@ApiBearerAuth()
export class CallCenterAdminController {
  constructor(
    private readonly service: CallCenterAdminService,
    private mail: ReactEmailService,
  ) {}

  @Post('/new')
  @ApiOperation({
    summary: 'Create a new call center account',
    description: 'Create a new call center account.',
    deprecated: true,
  })
  @ApiResponse({
    status: 201,
    description: 'The call center account has been created.',
    type: SuccessMessage,
  })
  async new(@Body() body: NewCallCenterRequest): Promise<SuccessMessage> {
    return this.service.new(body);
  }

  @Get('/info/:id')
  @ApiOperation({
    summary: 'Get the information about a call center account',
    description: 'Return all the information about a call center account.',
    deprecated: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The call center account',
    type: CallCenterInfoDto,
  })
  async info(@Query('id') id: string): Promise<CallCenterInfoDto> {
    return this.service.info(id);
  }

  @Get('/all')
  @ApiOperation({
    summary: 'Get all the call center accounts',
    description: 'Return all the call center accounts.',
    deprecated: true,
  })
  @ApiResponse({
    status: 200,
    description: 'All the call center accounts',
    type: [CallCenterInfoDto],
  })
  async all(): Promise<Array<CallCenterInfoDto>> {
    return this.service.all();
  }

  @Delete('/delete')
  @ApiOperation({
    summary: 'Delete a call center account',
    description: 'Delete a call center account.',
    deprecated: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The call center account has been deleted.',
    type: SuccessMessage,
  })
  async delete(@Body() body: DeleteCallCenterRequest): Promise<SuccessMessage> {
    return this.service.delete(body);
  }
}
