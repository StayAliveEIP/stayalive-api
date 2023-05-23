import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';

describe('AuthController', () => {
  let appController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();
    appController = app.get<AuthController>(AuthController);
  });

  describe('Register the rescuer', () => {
    it('should pass the register and get the message', async () => {
      const body: RegisterDTO = {
        email: 'test@test.net',
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

    describe('Login the rescuer', () => {
      it('should pass the login and get the access token', async () => {
        const body: LoginDTO = {
          email: 'test@test.net',
          password: 'password123!',
        };
        const loginResponsePromise = await appController.login(body);
        expect(loginResponsePromise.accessToken).toBeDefined();
      });
    });
  });
});
