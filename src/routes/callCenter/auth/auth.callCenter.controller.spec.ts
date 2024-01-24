import { AuthCallCenterController } from './auth.callCenter.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../validation/env.validation';
import { MailJetModule } from '../../../services/mailjet/mailjet.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from '../../rescuer/auth/auth.controller';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';
import mongoose from 'mongoose';
import { LoginCallCenterRequest } from './auth.callCenter.dto';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { AuthCallCenterService } from './auth.callCenter.service';

describe('AuthCallCenterController', () => {
  let appController: AuthCallCenterController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        // Set up the environment variables.
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidation,
        }),
        MailJetModule,
        // Connect to the MongoDB database.
        MongooseModule.forRoot(process.env.MONGODB_URI, {
          dbName: process.env.MONGODB_DATABASE,
        }),
        // Get the rescuer model.
        MongooseModule.forFeature([
          { name: CallCenter.name, schema: CallCenterSchema },
        ]),
      ],
      controllers: [AuthCallCenterController],
      providers: [ReactEmailService, AuthCallCenterService],
    }).compile();
    appController = app.get<AuthCallCenterController>(AuthCallCenterController);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('login the callCenter', () => {
    describe('Bad credentials', () => {
      it('should throw an error if the email is not found', async () => {
        const body: LoginCallCenterRequest = {
          email: 'noemail@hello.fr',
          password: 'password123!',
        };
        await expect(appController.login(body)).rejects.toThrowError(
          "Le centre d'appel n'a pas pu être trouvé.",
        );
      });
    });
  });
});
