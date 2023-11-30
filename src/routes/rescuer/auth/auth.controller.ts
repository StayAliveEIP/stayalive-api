import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDTO,
  LoginResponse,
  RegisterDTO,
  RegisterResponse,
} from './auth.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/rescuer')
@ApiTags('Authentification')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/auth/register')
  @ApiBody({ type: RegisterDTO })
  @ApiResponse({
    status: 200,
    description: 'The account was created.',
    type: RegisterResponse,
  })
  async register(@Body() body: RegisterDTO): Promise<RegisterResponse> {
    return this.service.register(body);
  }

  @Post('/auth/login')
  @ApiBody({ type: LoginDTO })
  @ApiResponse({
    status: 200,
    description: 'The rescuer was logged in.',
    type: LoginResponse,
  })
  async login(@Body() body: LoginDTO): Promise<LoginResponse> {
    return this.service.login(body);
  }
}
