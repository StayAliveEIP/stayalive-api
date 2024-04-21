import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { EmergencyController } from './emergency.controller';
import { EmergencyService } from './emergency.service';
import { Emergency, EmergencySchema } from '../../../database/emergency.schema';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';
import {
  Conversation,
  ConversationSchema,
} from '../../../database/conversation.schema';
import { Document, DocumentSchema } from '../../../database/document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Emergency.name, schema: EmergencySchema },
      { name: Rescuer.name, schema: RescuerSchema },
      { name: CallCenter.name, schema: CallCenterSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Document.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [EmergencyController],
  providers: [EmergencyService],
})
export class EmergencyModule {}
