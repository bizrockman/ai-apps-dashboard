import { BaseDAO } from './BaseDAO';
import { DocumentType, CreateDocumentTypeDTO, UpdateDocumentTypeDTO, CreateDocumentTypeBlockDTO } from '../models/DocumentType';

export interface DocumentTypeDAO extends BaseDAO<DocumentType, CreateDocumentTypeDTO, UpdateDocumentTypeDTO> {
  addBlock(data: CreateDocumentTypeBlockDTO): Promise<void>;
  removeBlock(documentTypeId: number, blockId: number): Promise<void>;
  reorderBlocks(documentTypeId: number, blockIds: number[]): Promise<void>;
}