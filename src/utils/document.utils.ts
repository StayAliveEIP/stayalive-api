/**
 * This private method verify if the type of document receive in the
 * parameter exist in the enumeration of {@link DocumentType}.<br />
 * If the document type is invalid or undefined an {@link BadRequestException} will
 * be thrown.
 * @param value The document type to verify.
 * @return The document type enum associated to the string.
 */
import { BadRequestException } from '@nestjs/common';
import { DocumentStatus, DocumentType } from '../database/document.schema';

export function verifyDocumentType(value: string | undefined): DocumentType {
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

export function verifyDocumentStatus(
  value: string | undefined,
): DocumentStatus {
  const documentStatus: string[] = Object.values(DocumentStatus);
  if (!value)
    throw new BadRequestException(
      `The value of the status of document is null or undefined: ${documentStatus}`,
    );
  // Loop over all enum possibility
  if (value in DocumentStatus) {
    return DocumentStatus[value as keyof typeof DocumentStatus];
  }
  throw new BadRequestException(
    `The status \"${value}\" of document do not exist on: ${documentStatus}`,
  );
}
