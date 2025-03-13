import { BaseDAO } from './BaseDAO';
import { Document, CreateDocumentDTO, UpdateDocumentDTO } from '../models/Document';

export interface DocumentDAO extends BaseDAO<Document, CreateDocumentDTO, UpdateDocumentDTO> {
  findByProject(projectId: number): Promise<Document[]>;
  findByType(typeId: number): Promise<Document[]>;
  findByStatus(status: Document['status']): Promise<Document[]>;
}