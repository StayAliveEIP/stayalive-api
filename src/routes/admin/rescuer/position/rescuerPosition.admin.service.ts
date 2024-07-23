import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rescuer } from '../../../../database/rescuer.schema';
import { RedisService } from '../../../../services/redis/redis.service';
import { RescuerPositionAdminResponse } from './rescuerPosition.admin.dto';

@Injectable()
export class RescuerPositionAdminService {
  private readonly logger: Logger = new Logger(
    RescuerPositionAdminService.name,
  );

  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    private readonly redis: RedisService,
  ) {}

  async getRescuerPosition(id: string): Promise<RescuerPositionAdminResponse> {
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
    const position = await this.redis.getPositionOfRescuer(objectId);
    if (!position) {
      throw new BadRequestException("La position du sauveteur n'existe pas");
    }
    return {
      lat: position.lat,
      long: position.lng,
    };
  }
}
