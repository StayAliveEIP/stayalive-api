import {
  DocumentStatus,
  DocumentType,
} from '../../../database/document.schema';

export class DocumentInformation {
  _id: string;
  documentType: DocumentType;
  status: DocumentStatus;
  message: string | null;
  lastUpdate: Date | null;
}
