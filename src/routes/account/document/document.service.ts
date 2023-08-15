import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import { Document } from '../../../database/document.schema';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    @InjectModel(Document.name) private documentModel: Model<Document>,
  ) {}

  async upload(file: Array<Express.Multer.File>): Promise<any> {
    const firstFile: Express.Multer.File = file[0];
    return { message: firstFile.size };
  }
}
