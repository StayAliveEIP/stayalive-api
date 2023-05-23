import { Body, Controller, Logger, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly appService: AuthService) {}

  @Post('/auth/register')
  async register(@Body() body: RegisterDTO): Promise<any> {
    return this.appService.register(body);
  }

  @Post('/auth/login')
  async login(@Body() body: LoginDTO): Promise<any> {
    return this.appService.login(body);
  }
}
