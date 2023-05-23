import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDTO } from './auth.dto';

describe('AuthController', () => {
  let appController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    appController = app.get<AuthController>(AuthController);
  });

  describe('Login the rescuer', () => {
    it('should pass the login and get the access token', async () => {
      const body: LoginDTO = {
        email: 'test@test.net',
        password: 'test',
      };

      const loginResponsePromise = await appController.login(body);

      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
