import mongoose, { Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../validation/env.validation';
import { MailJetModule } from '../../../services/mailjet/mailjet.module';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { AuthService } from '../auth/auth.service';
import { LoginDTO, LoginResponse, RegisterDTO } from '../auth/auth.dto';
import { AuthController } from '../auth/auth.controller';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { verifyToken } from '../../../utils/crypt.utils';

describe('AuthController', () => {
  let appController: AuthController;
  let accountController: AccountController;

  let accessToken: string | undefined;

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
      providers: [AuthService],
    }).compile();
    appController = appAuth.get<AuthController>(AuthController);

    const appAccount: TestingModule = await Test.createTestingModule({
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
      controllers: [AccountController],
      providers: [AccountService],
    }).compile();
    accountController = appAccount.get<AccountController>(AccountController);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Test to get account information', () => {
    describe('Register the rescuer', () => {
      it('should pass the register and get the message', async () => {
        const body: RegisterDTO = {
          email: email,
          firstname: 'test',
          lastname: 'test',
          password: 'password123!',
          phone: '0102030405',
        };
        const registerResponse = await appController.register(body);
        expect(registerResponse.message).toBe(
          'Votre compte à bien été enregistré, vous pouvez maintenant vous connecter !',
        );
      });
    });

    describe('Login the rescuer', () => {
      it('should pass the login and get the access token', async () => {
        const body: LoginDTO = {
          email: email,
          password: 'password123!',
        };
        const loginResponsePromise: LoginResponse =
          await appController.login(body);
        expect(loginResponsePromise.accessToken).toBeDefined();
        accessToken = loginResponsePromise.accessToken;
      });
    });

    describe('Get the account information', () => {
      it('should pass the get account information and get the account information', async () => {
        expect(accessToken).toBeDefined();
        const objectId: Types.ObjectId | null = verifyToken(
          accessToken.split(' ')[1],
        );
        expect(objectId).not.toBeNull();
        const request: any = {
          user: {
            userId: objectId,
          },
        };
        const response = await accountController.index(request as Request);
        expect(response.email.email).toBe(email);
        expect(response.firstname).toBe('test');
        expect(response.lastname).toBe('TEST');
        expect(response.phone.phone).toBe('0102030405');
      });
    });
  });
});
