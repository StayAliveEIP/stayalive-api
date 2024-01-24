import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../validation/env.validation';
import mongoose from 'mongoose';
import { MailJetModule } from '../../../services/mailjet/mailjet.module';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { RegisterDTO } from '../auth/auth.dto';
import { ForgotPasswordController } from './forgotPassword.controller';
import { ForgotPasswordService } from './forgotPassword.service';
import {
  ForgotPasswordLinkDTO,
  ForgotPasswordResetDTO,
} from './forgotPassword.dto';
import { NotFoundException } from '@nestjs/common';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import {ReactEmailService} from "../../../services/react-email/react-email.service";

describe('ForgotPasswordController', () => {
  let authController: AuthController;
  let forgotPasswordController: ForgotPasswordController;

  const randomNumberEmail: number = Math.floor(Math.random() * 1000000);
  const email: string = 'test+' + randomNumberEmail + '@test.net';

  beforeEach(async () => {
    const appAuth: TestingModule = await Test.createTestingModule({
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
          { name: Rescuer.name, schema: RescuerSchema },
        ]),
      ],
      controllers: [AuthController],
      providers: [AuthService, ReactEmailService],
    }).compile();
    authController = appAuth.get<AuthController>(AuthController);

    const appForgotPassword: TestingModule = await Test.createTestingModule({
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
          { name: Rescuer.name, schema: RescuerSchema },
        ]),
      ],
      controllers: [ForgotPasswordController],
      providers: [ForgotPasswordService, ReactEmailService],
    }).compile();
    forgotPasswordController = appForgotPassword.get<ForgotPasswordController>(
      ForgotPasswordController,
    );
  });

  afterAll(async () => {
    // Delete the random user on database
    await mongoose.disconnect();
  });

  describe('Register the rescuer and send a login link', () => {
    describe('Send a forgot password', () => {
      it('should not pass the forgot password form', async () => {
        const body: ForgotPasswordLinkDTO = {
          email: email,
        };
        await expect(forgotPasswordController.index(body)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('Register the rescuer', () => {
      it('should pass the register and get the message', async () => {
        const body: RegisterDTO = {
          email: email,
          firstname: 'test',
          lastname: 'test',
          password: 'password123!',
          phone: '0102030405',
        };
        const registerResponse = await authController.register(body);
        expect(registerResponse.message).toBe(
          'Votre compte à bien été enregistré, vous pouvez maintenant vous connecter !',
        );
      });
    });

    describe('Send a forgot password', () => {
      it('should pass the forgot password form', async () => {
        const body: ForgotPasswordLinkDTO = {
          email: email,
        };
        const response = await forgotPasswordController.index(body);
        expect(response.message).toBe(
          'Un code de réinitialisation vous a été envoyé par email.',
        );
      });
    });

    describe('Should modify the password', () => {
      it('should not pass the forgot password form', async () => {
        const body: ForgotPasswordResetDTO = {
          password: 'newPassword123!',
          token: '123456',
        };
        await expect(forgotPasswordController.reset(body)).rejects.toThrow(
          NotFoundException,
        );
      });
      it('should pass the forgot password form', async function () {
        // TODO: Get the token on the database and test the reset password
      });
    });
  });
});
