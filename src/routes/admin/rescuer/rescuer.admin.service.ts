import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import { Model, Types } from 'mongoose';
import { SuccessMessage } from '../../../dto.dto';
import {
  RescuerInfoAdminResponse,
  SuspendRescuerAdminRequest,
} from './rescuer.admin.dto';

@Injectable()
export class RescuerAdminService {
  private readonly logger: Logger = new Logger(RescuerAdminService.name);

  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}

  async suspendRescuer(
    body: SuspendRescuerAdminRequest,
  ): Promise<SuccessMessage> {
    const objectId = new Types.ObjectId(body.rescuerId);
    const rescuer = await this.rescuerModel.findOne({
      _id: objectId,
    });
    if (!rescuer) {
      throw new BadRequestException("Le sauveteur n'existe pas");
    }
    if (rescuer.suspended.suspended) {
      throw new BadRequestException('Le sauveteur est déjà suspendu');
    }
    rescuer.suspended.suspended = true;
    rescuer.suspended.reason = body.reason;
    await rescuer.save();
    return {
      message: 'Le sauveteur a été suspendu',
    };
  }

  async unsuspendRescuer(id: string): Promise<SuccessMessage> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id n'est pas valide");
    }
    const objectId = new Types.ObjectId(id);
    const rescuer = await this.rescuerModel.findOne({
      _id: objectId,
    });
    if (!rescuer) {
      throw new BadRequestException("Le sauveteur n'existe pas");
    }
    if (!rescuer.suspended) {
      throw new BadRequestException("Le sauveteur n'est pas suspendu");
    }
    rescuer.suspended.suspended = false;
    rescuer.suspended.reason = null;
    await rescuer.save();
    return {
      message: 'Le sauveteur a été réactivé',
    };
  }

  async getAllRescuers(): Promise<RescuerInfoAdminResponse[]> {
    const result: Array<Rescuer> = await this.rescuerModel.find();

    return result.map((rescuer) => {
      const suspended = rescuer.suspended?.suspended || false;
      return {
        _id: rescuer._id,
        firstname: rescuer.firstname,
        lastname: rescuer.lastname,
        email: rescuer.email.email,
        profilePictureUrl: rescuer.profilePictureUrl,
        suspended: suspended,
      };
    });
  }
}
