import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { Admin, AdminSchema } from '../../../database/admin.schema';
import { AuthAdminService } from './auth.admin.service';
import { AuthAdminController } from './auth.admin.controller';
import { ReactEmailModule } from '../../../services/react-email/react-email.module';

@Module({
  imports: [
    ReactEmailModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  controllers: [AuthAdminController],
  providers: [JwtStrategy, AuthAdminService],
})
export class AuthAdminModule {}
