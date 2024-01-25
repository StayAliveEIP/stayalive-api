import { verifyDocumentType, verifyDocumentStatus } from './document.utils';
import { BadRequestException } from '@nestjs/common';
import { DocumentStatus, DocumentType } from '../database/document.schema';

describe('Document Utilities', () => {
  describe('verifyDocumentType', () => {
    it('should return a valid document type for a valid input', () => {
      expect(verifyDocumentType('ID_CARD')).toBe(DocumentType.ID_CARD);
      expect(verifyDocumentType('RESCUER_CERTIFICATE')).toBe(
        DocumentType.RESCUER_CERTIFICATE,
      );
    });

    it('should throw BadRequestException for invalid input', () => {
      expect(() => verifyDocumentType('INVALID_TYPE')).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for undefined input', () => {
      expect(() => verifyDocumentType(undefined)).toThrow(BadRequestException);
    });
  });

  describe('verifyDocumentStatus', () => {
    it('should return a valid document status for a valid input', () => {
      expect(verifyDocumentStatus('VALID')).toBe(DocumentStatus.VALID);
      expect(verifyDocumentStatus('NOT_VALID')).toBe(DocumentStatus.NOT_VALID);
      expect(verifyDocumentStatus('PENDING')).toBe(DocumentStatus.PENDING);
    });

    it('should throw BadRequestException for invalid input', () => {
      expect(() => verifyDocumentStatus('INVALID_STATUS')).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for undefined input', () => {
      expect(() => verifyDocumentStatus(undefined)).toThrow(
        BadRequestException,
      );
    });
  });
});
