import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import { Model } from 'mongoose';

@Injectable()
export class MagicLoginService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}
  async validateUser(email: string) {
    //find user in db
    const user: Rescuer = await this.rescuerModel.findOne({
      'email.email': email,
    });

    if (!user) {
      throw new UnauthorizedException("Aucun compte n'existe avec cet email.");
    }

    return user;
  }
}
