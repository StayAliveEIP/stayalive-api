import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Logger } from '@nestjs/common';
import { AppService } from '../app.service';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(AppService.name);

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: 'redis://' + process.env.REDIS_URL + ':' + process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
    this.logger.log('Adapter created');
  }

  createIOServer(port: number, options?: ServerOptions): any {
    options.transports = ['websocket'];
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
