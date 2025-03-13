import { TextBlockDAO } from '../dao/TextBlockDAO';
import { TextBlock, CreateTextBlockDTO, UpdateTextBlockDTO } from '../models/TextBlock';
import { IndexedDBStorage } from '../storage/IndexedDBStorage';

export class JsonTextBlockDAO implements TextBlockDAO {
  private storage = IndexedDBStorage.getInstance();
  private readonly STORE_NAME = 'textBlocks';

  async findAll(): Promise<TextBlock[]> {
    const blocks = await this.storage.getAll(this.STORE_NAME);
    return blocks.map(this.mapDates);
  }

  async findById(id: number): Promise<TextBlock | null> {
    const block = await this.storage.get(this.STORE_NAME, id);
    return block ? this.mapDates(block) : null;
  }

  async findByShortcut(shortcut: string): Promise<TextBlock | null> {
    const blocks = await this.storage.getAll(this.STORE_NAME);
    const block = blocks.find(b => b.shortcut === shortcut);
    return block ? this.mapDates(block) : null;
  }

  async create(data: CreateTextBlockDTO): Promise<TextBlock> {
    // Check if shortcut already exists
    const existing = await this.findByShortcut(data.shortcut);
    if (existing) {
      throw new Error(`A text block with shortcut "${data.shortcut}" already exists`);
    }

    // Ensure we don't pass an id for new records
    const { id, ...createData } = data as any;
    const newId = await this.storage.add(this.STORE_NAME, createData);
    return this.findById(newId) as Promise<TextBlock>;
  }

  async update(data: UpdateTextBlockDTO): Promise<TextBlock> {
    const existing = await this.findById(data.id);
    if (!existing) {
      throw new Error('Text block not found');
    }

    // If shortcut is being changed, check if new shortcut already exists
    if (data.shortcut && data.shortcut !== existing.shortcut) {
      const existingWithShortcut = await this.findByShortcut(data.shortcut);
      if (existingWithShortcut && existingWithShortcut.id !== data.id) {
        throw new Error(`A text block with shortcut "${data.shortcut}" already exists`);
      }
    }

    await this.storage.put(this.STORE_NAME, data);
    return this.findById(data.id) as Promise<TextBlock>;
  }

  async delete(id: number): Promise<boolean> {
    const block = await this.findById(id);
    if (!block) {
      return false;
    }

    await this.storage.delete(this.STORE_NAME, id);
    return true;
  }

  private mapDates(block: any): TextBlock {
    return {
      ...block,
      createdAt: new Date(block.createdAt),
      updatedAt: new Date(block.updatedAt)
    };
  }
}