import {
  Injectable,
  InternalServerErrorException,
  Request,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import { AccountIndexResponse } from '../account.dto';

enum DocumentType {
  ID_CARD = 'ID_CARD',
  AID_CERTIFICATE = 'AID_CERTIFICATE',
}

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}

  async upload(file: Array<Express.Multer.File>): Promise<any> {
    console.log(file);
    return { message: 'OK' };
  }
}
