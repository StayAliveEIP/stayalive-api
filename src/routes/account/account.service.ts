import {
  Injectable,
  InternalServerErrorException,
  Request,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AccountIndexResponse } from './account.dto';
import { Rescuer } from '../../database/rescuer.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}

  async index(req: Request): Promise<AccountIndexResponse> {
    const userId: string = req['user'].userId;
    const user: Rescuer = await this.rescuerModel.findById(
      new Types.ObjectId(userId),
    );
    if (!user) {
      throw new InternalServerErrorException('Utilisateur introuvable.');
    }
    return {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: {
        email: user.email.email,
        verified: user.email.verified,
      },
      phone: {
        phone: user.phone.phone,
        verified: user.phone.verified,
      },
    };
  }

  async changeInfos(firstName: string, lastName: string, req: Request) {
    const userId: string = req['user'].userId;
    const user = await this.rescuerModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new InternalServerErrorException('Utilisateur introuvable.');
    }
    user.firstname = firstName;
    user.lastname = lastName;
    await user.save();
  }
}
