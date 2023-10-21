import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Types } from 'mongoose';

export const UserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;
    if (!user || !user.userId) throw new InternalServerErrorException();
    return new Types.ObjectId(user.userId);
  },
);
