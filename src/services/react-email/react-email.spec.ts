jest.useFakeTimers();

import { Test, TestingModule } from '@nestjs/testing';
import { ReactEmailService } from './react-email.service';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../validation/env.validation';

describe('ReactEmailService', () => {
  let reactEmailService: ReactEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidation,
        }),
      ],
      providers: [ReactEmailService],
    }).compile();

    reactEmailService = module.get<ReactEmailService>(ReactEmailService);
  });

  it('should be defined', () => {
    expect(reactEmailService).toBeDefined();
  });

  it('should send a verification account email', async () => {
    const email = 'test@example.com';
    const username = 'testuser';
    const link = 'https://example.com/verify';

    reactEmailService.sendVerifyAccountEmail(email, username, link);
  });

  it('should send a magic link email', async () => {
    const email = 'test@example.com';
    const username = 'testuser';
    const link = 'https://example.com/magic-link';

    reactEmailService.sendMagicLinkEmail(email, username, link);
  });

  it('should send a created account password email', async () => {
    const email = 'test@example.com';
    const username = 'testuser';
    const password = 'testpassword';

    reactEmailService.sendMailCreatedAccountPassword(email, username, password);
  });

  it('should send a forgot password code email', async () => {
    const email = 'test@example.com';
    const username = 'testuser';
    const code = '123456';

    reactEmailService.sendMailForgotPasswordCode(email, username, code);
  });

  it('should send a verify email code email', async () => {
    const email = 'test@example.com';
    const username = 'testuser';
    const code = '789012';

    reactEmailService.sendMailVerifyEmailCode(email, username, code);
  });
});
