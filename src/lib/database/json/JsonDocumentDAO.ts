import { DocumentDAO } from '../dao/DocumentDAO';
import { Document, CreateDocumentDTO, UpdateDocumentDTO } from '../models/Document';
import { IndexedDBStorage } from '../storage/IndexedDBStorage';

export class JsonDocumentDAO implements DocumentDAO {
  private storage = IndexedDBStorage.getInstance();
  private readonly STORE_NAME = 'documents';

  async findAll(): Promise<Document[]> {
    const documents = await this.storage.getAll(this.STORE_NAME);
    return documents.map(this.mapDates);
  }

  async findById(id: number): Promise<Document | null> {
    const document = await this.storage.get(this.STORE_NAME, id);
    return document ? this.mapDates(document) : null;
  }

  async findByProject(projectId: number): Promise<Document[]> {
    const documents = await this.storage.getAll(this.STORE_NAME);
    return documents
      .filter(d => d.projectId === projectId)
      .map(this.mapDates);
  }

  async findByType(typeId: number): Promise<Document[]> {
    const documents = await this.storage.getAll(this.STORE_NAME);
    return documents
      .filter(d => d.typeId === typeId)
      .map(this.mapDates);
  }

  async findByStatus(status: Document['status']): Promise<Document[]> {
    const documents = await this.storage.getAll(this.STORE_NAME);
    return documents
      .filter(d => d.status === status)
      .map(this.mapDates);
  }

  async create(data: CreateDocumentDTO): Promise<Document> {
    const id = await this.storage.add(this.STORE_NAME, data);
    return this.findById(id) as Promise<Document>;
  }

  async update(data: UpdateDocumentDTO): Promise<Document> {
    const existing = await this.findById(data.id);
    if (!existing) {
      throw new Error('Document not found');
    }

    await this.storage.put(this.STORE_NAME, data);
    return this.findById(data.id) as Promise<Document>;
  }

  async delete(id: number): Promise<boolean> {
    const document = await this.findById(id);
    if (!document) {
      return false;
    }

    await this.storage.delete(this.STORE_NAME, id);
    return true;
  }

  private mapDates(document: any): Document {
    return {
      ...document,
      createdAt: new Date(document.createdAt),
      updatedAt: new Date(document.updatedAt)
    };
  }
}