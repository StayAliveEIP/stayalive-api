import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmergencyService } from './emergency.service';
import {
  deleteEmergencyDto,
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
    await this.service.createEmergency(body);
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
    await this.service.modifyEmergency(body, id);
  }

  @Delete('/emergency')
  @ApiBody({ type: deleteEmergencyDto })
  @ApiResponse({
    status: 200,
    description: 'The emergency was deleted.',
    type: deleteEmergencyDto,
  })
  async deleteEmergency(@Query() query: deleteEmergencyDto) {
    await this.service.deleteEmergency(query.id);
  }
}
