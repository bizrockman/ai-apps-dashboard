import { BaseDAO } from './BaseDAO';
import { DocumentType, CreateDocumentTypeDTO, UpdateDocumentTypeDTO, CreateDocumentTypeBlockDTO } from '../models/DocumentType';

export interface DocumentTypeDAO extends BaseDAO<DocumentType, CreateDocumentTypeDTO, UpdateDocumentTypeDTO> {
  addBlock(data: CreateDocumentTypeBlockDTO): Promise<void>;
  removeBlock(documentTypeId: string, blockId: string): Promise<void>;
  reorderBlocks(documentTypeId: string, blockIds: string[]): Promise<void>;
}