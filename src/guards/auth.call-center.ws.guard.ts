import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class WsCallCenterGuard implements CanActivate {
  constructor(private jwtStrategy: JwtStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<any>();
    const token = this.extractJwtToken(client);

    if (!token) {
      return false;
    }

    try {
      const user = await this.jwtStrategy.validate({ id: token });
      client.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }

  private extractJwtToken(client: any): string | null {
    const token = client.handshake?.query?.token;
    return token;
  }
}
