import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LinkService } from './link.service';
import { createLinkDto, deleteLinkDto } from './link.dto';

@Controller('link')
@ApiTags('Link')
export class LinkController {
  constructor(private readonly service: LinkService) {}

  @Post('/')
  @ApiBody({ type: createLinkDto })
  async createLink(@Body() body: createLinkDto) {
    return await this.service.createLink(body.url, body.expiresAt);
  }

  @Delete('/')
  @ApiBody({ type: deleteLinkDto })
  async deleteLink(@Body() body: deleteLinkDto) {
    return await this.service.deleteLink(body.id);
  }
}
