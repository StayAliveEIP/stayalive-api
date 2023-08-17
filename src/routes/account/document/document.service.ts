import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import {
  Document,
  DocumentStatus,
  DocumentType,
} from '../../../database/document.schema';
import { DocumentInformation } from './document.dto';
import type { Response, Request } from 'express';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    @InjectModel(Document.name) private documentModel: Model<Document>,
  ) {}

  async documentInformation(
    req: Request,
    type: string | undefined,
  ): Promise<any> {
    // Verify if the type is in the array of enum DocumentType
    const documentType: DocumentType = this.verifyDocumentType(type);
    const userId: string = req['user'].userId;

    const result: DocumentInformation = {
      _id: userId,
      documentType: documentType,
      message: null,
      lastUpdate: new Date(),
      status: DocumentStatus.PENDING,
    };

    return result;
  }

  async upload(
    req: Request,
    type: string,
    file: Array<Express.Multer.File>,
  ): Promise<any> {
    // Verify if the type is in the array of enum DocumentType
    const documentType: DocumentType = this.verifyDocumentType(type);
    const userId: Types.ObjectId = new Types.ObjectId(req['user'].userId);
    const firstFile: Express.Multer.File = file[0];

    // Delete the other document stored in the database.
    await this.documentModel.deleteMany({
      user: userId,
      type: documentType,
    });

    const docToInsert: Document = {
      _id: new Types.ObjectId(),
      user: userId,
      lastUpdate: new Date(),
      type: documentType,
      message: null,
      status: DocumentStatus.PENDING,
      binaryFile: firstFile.buffer,
      mimeType: firstFile.mimetype,
    };
    await this.documentModel.create(docToInsert);
    return { message: 'You document was successfully uploaded !' };
  }

  async download(
    req: Request,
    res: Response,
    type: string,
  ): Promise<StreamableFile> {
    // Verify if the type is in the array of enum DocumentType
    const documentType: DocumentType = this.verifyDocumentType(type);
    const userId: Types.ObjectId = new Types.ObjectId(req['user'].userId);

    const resultDoc: Document = await this.documentModel.findOne({
      user: userId,
      type: documentType,
    });
    if (!resultDoc)
      throw new NotFoundException(
        `The document with type \"${documentType}\" was not uploaded.`,
      );
    res.setHeader('Content-Type', resultDoc.mimeType);
    return new StreamableFile(resultDoc.binaryFile);
  }

  /**
   * This private method verify if the type of document receive in the
   * parameter exist in the enumeration of {@link DocumentType}.<br />
   * If the document type is invalid or undefined an {@link BadRequestException} will
   * be thrown.
   * @param value The document type to verify.
   * @return The document type enum associated to the string.
   */
  private verifyDocumentType(value: string | undefined): DocumentType {
    const documentTypes: string[] = Object.values(DocumentType);
    if (!value)
      throw new BadRequestException(
        `The value of the type of document is null or undefined: ${documentTypes}`,
      );
    // Loop over all enum possibility
    if (value in DocumentType) {
      return DocumentType[value as keyof typeof DocumentType];
    }
    throw new BadRequestException(
      `The type \"${value}\" of document do not exist on: ${documentTypes}`,
    );
  }
}
