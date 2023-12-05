import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthGuard } from '@nestjs/passport';
import { GuardsConsumer } from '@nestjs/core/guards';

@Injectable()
export class WsRescuerGuard extends GuardsConsumer {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    throw new WsException('Unauthorized access');
  }
}
