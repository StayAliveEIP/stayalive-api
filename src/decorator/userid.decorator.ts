import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Types } from 'mongoose';

export const UserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;
    if (!user) {
      throw new InternalServerErrorException(
        "L'utilisateur n'a pas pu être trouvé",
      );
    }
    if (!user.userId) {
      throw new InternalServerErrorException(
        "L'id de l'utilisateur n'a pas pu être trouvé",
      );
    }
    return new Types.ObjectId(user.userId);
  },
);
