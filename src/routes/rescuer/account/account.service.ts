import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AccountIndexResponse,
  DeleteRescuerAccountRequest,
} from './account.dto';
import { Rescuer } from '../../../database/rescuer.schema';
import { SuccessMessage } from '../../../dto.dto';
import { verifyPassword } from '../../../utils/crypt.utils';

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
    return {
      message: 'Les informations ont bien été modifiées.',
      user: user,
    };
  }

  async deleteAccount(
    userId: Types.ObjectId,
    body: DeleteRescuerAccountRequest,
  ): Promise<SuccessMessage> {
    const user = await this.rescuerModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    const validPassword = verifyPassword(user.password.password, body.password);
    if (!validPassword) {
      throw new ForbiddenException(
        'Mot de passe incorrect, impossible de supprimer le compte.',
      );
    }
    const deleteResult = await this.rescuerModel.deleteOne({
      _id: new Types.ObjectId(userId),
    });
    if (deleteResult.deletedCount !== 1) {
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la suppression du compte.',
      );
    }
    return {
      message: 'Votre compte a bien été supprimé.',
    };
  }
}
