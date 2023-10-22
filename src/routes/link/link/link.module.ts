import { Module } from '@nestjs/common';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { LinkSchema } from '../../../database/link.schema';
import { Link } from '@react-email/components';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Link.name, schema: LinkSchema },
      { name: Rescuer.name, schema: RescuerSchema },
    ]),
  ],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}
