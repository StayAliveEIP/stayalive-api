import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  StreamableFile,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../../../database/admin.schema';
import { Model, Types } from 'mongoose';
import {
  Document,
  DocumentStatus,
  DocumentType,
} from '../../../database/document.schema';
import {
  DocumentRescuerAdminChangeStatusRequest,
  DocumentRescuerAdminInfoDataResponse,
  DocumentRescuerAdminInfoResponse,
} from './document.admin.dto';
import { SuccessMessage } from '../../../dto.dto';
import {
  verifyDocumentStatus,
  verifyDocumentType,
} from '../../../utils/document.utils';
import { Response } from 'express';
import { Rescuer } from '../../../database/rescuer.schema';
import { async } from 'rxjs';

@Injectable()
export class DocumentAdminService {
  private readonly logger: Logger = new Logger(DocumentAdminService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    @InjectModel(Document.name) private documentModel: Model<Document>,
  ) {}

  async all(
    rescuerId: string,
  ): Promise<Array<DocumentRescuerAdminInfoResponse>> {
    // verify if the id is a valid object id
    if (!Types.ObjectId.isValid(rescuerId)) {
      throw new BadRequestException("L'id n'est pas valide");
    }
    // verify if the rescuer exists
    const rescuer = await this.rescuerModel.findOne({
      _id: new Types.ObjectId(rescuerId),
    });
    if (!rescuer) {
      throw new NotFoundException("Le secouriste n'existe pas");
    }
    const allDocumentTypes = Object.values(DocumentType);
    const allDocuments: Array<DocumentRescuerAdminInfoResponse> = [];
    for (const documentType of allDocumentTypes) {
      const resultType: DocumentRescuerAdminInfoResponse = {
        type: documentType,
        data: null,
      };
      const document = await this.documentModel.findOne({
        user: rescuerId,
        type: documentType,
      });
      if (document) {
        const data: DocumentRescuerAdminInfoDataResponse = {
          id: document._id.toString(),
          documentType: document.type,
          status: document.status,
          message: document.message,
          lastUpdate: document.lastUpdate,
        };
        resultType.data = data;
      }
      allDocuments.push(resultType);
    }
    return allDocuments;
  }

  async status(
    body: DocumentRescuerAdminChangeStatusRequest,
  ): Promise<SuccessMessage> {
    const id = body.id;
    // Verify if the id in a valid object id
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id n'est pas valide");
    }
    // Verify if the document exists
    const document = await this.documentModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!document) {
      throw new NotFoundException("Le document n'existe pas");
    }
    // Verify if the status is a valid status
    const documentStatus = verifyDocumentStatus(body.newStatus);
    // Verify if the document has already the same status
    if (document.status === body.newStatus) {
      throw new BadRequestException('Le document a déjà ce status');
    }
    // Return the success message
    document.status = documentStatus;
    const result = await document.save();
    if (!result) {
      throw new InternalServerErrorException(
        'Impossible de mettre à jour le status du document',
      );
    }
    return {
      message: 'Le status du document a été mis à jour',
    };
  }

  async download(id: string, res: Response): Promise<StreamableFile> {
    // Verify if the id in a valid object id
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("L'id n'est pas valide");
    }
    // Verify if the document exists
    const document = await this.documentModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!document) {
      throw new NotFoundException("Le document n'existe pas");
    }
    res.setHeader('Content-Type', document.mimeType);
    return new StreamableFile(document.binaryFile);
  }
}
