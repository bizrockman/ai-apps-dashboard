import { DocumentTypeDAO } from '../dao/DocumentTypeDAO';
import { DocumentType, CreateDocumentTypeDTO, UpdateDocumentTypeDTO, CreateDocumentTypeBlockDTO, DocumentTypeBlock } from '../models/DocumentType';
import { IndexedDBStorage } from '../storage/IndexedDBStorage';

export class JsonDocumentTypeDAO implements DocumentTypeDAO {
  private storage = IndexedDBStorage.getInstance();
  private readonly STORE_NAME = 'documentTypes';
  private readonly BLOCKS_STORE = 'documentTypeBlocks';

  async findAll(): Promise<DocumentType[]> {
    const types = await this.storage.getAll(this.STORE_NAME);
    return Promise.all(types.map(type => this.getTypeWithBlocks(type)));
  }

  async findById(id: number): Promise<DocumentType | null> {
    const type = await this.storage.get(this.STORE_NAME, id);
    return type ? this.getTypeWithBlocks(type) : null;
  }

  async create(data: CreateDocumentTypeDTO): Promise<DocumentType> {
    const id = await this.storage.add(this.STORE_NAME, { ...data, blocks: [] });
    return this.findById(id) as Promise<DocumentType>;
  }

  async update(data: UpdateDocumentTypeDTO): Promise<DocumentType> {
    const existing = await this.findById(data.id);
    if (!existing) {
      throw new Error('Document type not found');
    }

    await this.storage.put(this.STORE_NAME, data);
    return this.findById(data.id) as Promise<DocumentType>;
  }

  async delete(id: number): Promise<boolean> {
    const type = await this.findById(id);
    if (!type) {
      return false;
    }

    // Delete all blocks first
    const blocks = await this.storage.getAll(this.BLOCKS_STORE);
    for (const block of blocks) {
      if (block.documentTypeId === id) {
        await this.storage.delete(this.BLOCKS_STORE, block.id);
      }
    }

    await this.storage.delete(this.STORE_NAME, id);
    return true;
  }

  async addBlock(data: CreateDocumentTypeBlockDTO): Promise<void> {
    const type = await this.findById(data.documentTypeId);
    if (!type) {
      throw new Error('Document type not found');
    }

    await this.storage.add(this.BLOCKS_STORE, data);
  }

  async removeBlock(documentTypeId: number, blockId: number): Promise<void> {
    await this.storage.delete(this.BLOCKS_STORE, blockId);
  }

  async reorderBlocks(documentTypeId: number, blockIds: number[]): Promise<void> {
    const blocks = await this.storage.getAll(this.BLOCKS_STORE);
    const updates = blocks
      .filter(block => block.documentTypeId === documentTypeId)
      .map((block, index) => ({
        ...block,
        order: blockIds.indexOf(block.id)
      }));

    for (const block of updates) {
      await this.storage.put(this.BLOCKS_STORE, block);
    }
  }

  private async getTypeWithBlocks(type: any): Promise<DocumentType> {
    const blocks = await this.storage.getAll(this.BLOCKS_STORE);
    const typeBlocks = blocks
      .filter(block => block.documentTypeId === type.id)
      .sort((a, b) => a.order - b.order);

    return {
      ...type,
      blocks: typeBlocks,
      createdAt: new Date(type.createdAt),
      updatedAt: new Date(type.updatedAt)
    };
  }
}