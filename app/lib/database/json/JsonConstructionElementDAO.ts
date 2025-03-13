import { ConstructionElementDAO } from '../dao/ConstructionElementDAO';
import { ConstructionElement, CreateConstructionElementDTO, UpdateConstructionElementDTO } from '../models/ConstructionElement';
import { IndexedDBStorage } from '../storage/IndexedDBStorage';

export class JsonConstructionElementDAO implements ConstructionElementDAO {
  private storage = IndexedDBStorage.getInstance();
  private readonly STORE_NAME = 'constructionElements';

  async findAll(): Promise<ConstructionElement[]> {
    const elements = await this.storage.getAll(this.STORE_NAME);
    return elements.map(this.mapDates);
  }

  async findById(id: number): Promise<ConstructionElement | null> {
    const element = await this.storage.get(this.STORE_NAME, id);
    return element ? this.mapDates(element) : null;
  }

  async findByProject(projectId: number): Promise<ConstructionElement[]> {
    const elements = await this.storage.getAll(this.STORE_NAME);
    return elements
      .filter(e => e.projectId === projectId)
      .map(this.mapDates);
  }

  async findByCode(code: string): Promise<ConstructionElement | null> {
    const elements = await this.storage.getAll(this.STORE_NAME);
    const element = elements.find(e => e.code === code);
    return element ? this.mapDates(element) : null;
  }

  async create(data: CreateConstructionElementDTO): Promise<ConstructionElement> {
    const id = await this.storage.add(this.STORE_NAME, data);
    return this.findById(id) as Promise<ConstructionElement>;
  }

  async update(data: UpdateConstructionElementDTO): Promise<ConstructionElement> {
    const existing = await this.findById(data.id);
    if (!existing) {
      throw new Error('Construction element not found');
    }

    await this.storage.put(this.STORE_NAME, data);
    return this.findById(data.id) as Promise<ConstructionElement>;
  }

  async delete(id: number): Promise<boolean> {
    const element = await this.findById(id);
    if (!element) {
      return false;
    }

    await this.storage.delete(this.STORE_NAME, id);
    return true;
  }

  private mapDates(element: any): ConstructionElement {
    return {
      ...element,
      createdAt: new Date(element.createdAt),
      updatedAt: new Date(element.updatedAt)
    };
  }
}