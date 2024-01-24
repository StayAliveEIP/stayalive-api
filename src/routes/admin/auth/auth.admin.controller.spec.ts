import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminController } from './auth.admin.controller';
import { AuthAdminService } from './auth.admin.service';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { LoginAdminRequest, LoginAdminResponse } from './auth.admin.dto';

describe('AuthAdminController', () => {
  let controller: AuthAdminController;
  let authService: AuthAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthAdminController],
      providers: [
        {
          provide: AuthAdminService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: ReactEmailService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthAdminController>(AuthAdminController);
    authService = module.get<AuthAdminService>(AuthAdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login an admin and return a token', async () => {
      const mockLoginRequest: LoginAdminRequest = {
        email: 'john@doe.net',
        password: 'myPassword123',
      };
      const mockLoginResponse: LoginAdminResponse = {
        token: 'mockToken123',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockLoginRequest);
      expect(result).toEqual(mockLoginResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginRequest);
    });
  });
});
