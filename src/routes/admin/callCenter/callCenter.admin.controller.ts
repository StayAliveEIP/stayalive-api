import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
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
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { CallCenterAdminService } from './callCenter.admin.service';
import {
  CallCenterInfoDto,
  DeleteCallCenterRequest,
  NewCallCenterRequest,
  PatchCallCenterRequest,
} from './callCenter.admin.dto';
import { SuccessMessage } from '../../../dto.dto';
import { AdminAuthGuard } from 'src/guards/auth.route.guard';
import { DefibrillatorStatus } from '../../../database/defibrillator.schema';

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
  })
  @ApiResponse({
    status: 201,
    description: 'The call center account has been created.',
    type: SuccessMessage,
  })
  @UseGuards(AdminAuthGuard)
  async new(@Body() body: NewCallCenterRequest): Promise<SuccessMessage> {
    console.log(body);
    return this.service.new(body);
  }

  @Get('/info')
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
  @UseGuards(AdminAuthGuard)
  async info(
    @Query() body: DeleteCallCenterRequest,
  ): Promise<CallCenterInfoDto> {
    return this.service.info(body.id);
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
  @UseGuards(AdminAuthGuard)
  async all(): Promise<Array<CallCenterInfoDto>> {
    return this.service.all();
  }

  @Delete('/delete')
  @ApiOperation({
    summary: 'Delete a call center account',
    description: 'Delete a call center account.',
  })
  @ApiResponse({
    status: 200,
    description: 'The call center account has been deleted.',
    type: SuccessMessage,
  })
  @UseGuards(AdminAuthGuard)
  async delete(
    @Query() body: DeleteCallCenterRequest,
  ): Promise<SuccessMessage> {
    return this.service.delete(body);
  }

  @Patch('/update')
  @ApiOperation({
    summary: 'Update a call center account',
    description: 'Update a call center account.',
  })
  @ApiResponse({
    status: 200,
    description: 'The call center account has been updated.',
    type: SuccessMessage,
  })
  @UseGuards(AdminAuthGuard)
  async update(@Body() body: PatchCallCenterRequest): Promise<SuccessMessage> {
    return this.service.updateCallCenterInfo(body);
  }
}
