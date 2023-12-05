import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { Admin, AdminSchema } from '../../../database/admin.schema';
import { AccountAdminController } from './account.admin.controller';
import { AccountAdminService } from './account.admin.service';
import {ReactEmailModule} from "../../../services/react-email/react-email.module";

@Module({
  imports: [
    ReactEmailModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  controllers: [AccountAdminController],
  providers: [JwtStrategy, AccountAdminService],
})
export class AccountAdminModule {}
