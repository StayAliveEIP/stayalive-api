import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor() {}

  public async get(key: string): Promise<any> {
    return null;
  }
}
