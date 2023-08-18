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
import type { Request, Response } from 'express';
import { SuccessMessage } from '../../../dto.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    @InjectModel(Document.name) private documentModel: Model<Document>,
  ) {}

  async documentInformation(
    userId: Types.ObjectId,
    type: string | undefined,
  ): Promise<DocumentInformation> {
    // Verify if the type is in the array of enum DocumentType
    const documentType: DocumentType = this.verifyDocumentType(type);

    const docInDB: Document | undefined = await this.documentModel.findOne({
      user: userId,
      type: documentType,
    });
    if (!docInDB)
      throw new NotFoundException(
        `The document with type \"${documentType}\" was not uploaded.`,
      );
    return {
      _id: userId.toString(),
      documentType: documentType,
      message: null,
      lastUpdate: new Date(),
      status: DocumentStatus.PENDING,
    };
  }

  async upload(
    userId: Types.ObjectId,
    type: string,
    file: Array<Express.Multer.File>,
  ): Promise<SuccessMessage> {
    // Verify if the type is in the array of enum DocumentType
    const documentType: DocumentType = this.verifyDocumentType(type);
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
    return { message: 'Your document was successfully uploaded !' };
  }

  async download(
    userId: Types.ObjectId,
    res: Response,
    type: string,
  ): Promise<StreamableFile> {
    // Verify if the type is in the array of enum DocumentType
    const documentType: DocumentType = this.verifyDocumentType(type);

    const resultDoc: Document | undefined = await this.documentModel.findOne({
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

  async delete(userId: Types.ObjectId, type: string): Promise<SuccessMessage> {
    // Verify if the type is in the array of enum DocumentType
    const documentType: DocumentType = this.verifyDocumentType(type);

    const resultDelete = await this.documentModel.deleteMany({
      user: userId,
      type: documentType,
    });
    if (resultDelete.deletedCount === 0)
      throw new NotFoundException(
        'No document was deleted because not document was uploaded for type: ' +
          documentType,
      );
    return {
      message:
        'Your document of type' + documentType + ' was successfully deleted.',
    };
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
