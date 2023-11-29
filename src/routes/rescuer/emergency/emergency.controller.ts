import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmergencyService } from './emergency.service';
import {
  assignEmergencyDto,
  deleteEmergencyDto,
  getEmergencyOfRescuerDto,
  modifyEmergencyDto,
  newEmergencyDto,
} from './emergency.dto';

@Controller()
@ApiTags('Emergency')
export class EmergencyController {
  constructor(private readonly service: EmergencyService) {}

  @Post('/emergency')
  @ApiBody({ type: newEmergencyDto })
  @ApiResponse({
    status: 200,
    description: 'The emergency was created.',
    type: newEmergencyDto,
  })
  async createEmergency(@Body() body: newEmergencyDto) {
    return await this.service.createEmergency(body);
  }

  @Put('/emergency')
  @ApiBody({ type: modifyEmergencyDto })
  @ApiResponse({
    status: 200,
    description: 'The emergency was modified.',
    type: modifyEmergencyDto,
  })
  async modifyEmergency(@Body() body: modifyEmergencyDto) {
    const id = body.id;
    delete body.id;
    return await this.service.modifyEmergency(body, id);
  }

  @Delete('/emergency')
  @ApiBody({ type: deleteEmergencyDto })
  @ApiResponse({
    status: 200,
    description: 'The emergency was deleted.',
    type: deleteEmergencyDto,
  })
  async deleteEmergency(@Query() query: deleteEmergencyDto) {
    return await this.service.deleteEmergency(query.id);
  }

  @Get('/emergency/rescuer')
  async getAllEmergencyOfRescuer(@Query() query: getEmergencyOfRescuerDto) {
    return await this.service.getAllEmergencyOfRescuer(query.id);
  }

  @Get('/emergency/rescuer/actual')
  async getActualEmergencyOfRescuer(@Query() query: getEmergencyOfRescuerDto) {
    return await this.service.getActualEmergencyOfRescuer(query.id);
  }

  @Post('/emergency/rescuer/cancel')
  async cancelEmergencyOfRescuer(@Body() query: assignEmergencyDto) {
    return await this.service.cancelEmergencyofRescuer(query.id, query.rescuer);
  }

  @Post('/emergency/rescuer/assign')
  async assignEmergencyOfRescuer(@Body() query: assignEmergencyDto) {
    return await this.service.assignEmergency(query.id, query.rescuer);
  }
}
