import { ClientDAO } from '../dao/ClientDAO';
import { Client, CreateClientDTO, UpdateClientDTO } from '../models/Client';
import { IndexedDBStorage } from '../storage/IndexedDBStorage';

export class JsonClientDAO implements ClientDAO {
  private storage = IndexedDBStorage.getInstance();
  private readonly STORE_NAME = 'clients';

  async findAll(): Promise<Client[]> {
    const clients = await this.storage.getAll(this.STORE_NAME);
    return clients.map(this.mapDates);
  }

  async findById(id: number): Promise<Client | null> {
    const client = await this.storage.get(this.STORE_NAME, id);
    return client ? this.mapDates(client) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const clients = await this.storage.getAll(this.STORE_NAME);
    const client = clients.find(c => c.email === email);
    return client ? this.mapDates(client) : null;
  }

  async findByName(name: string): Promise<Client[]> {
    const clients = await this.storage.getAll(this.STORE_NAME);
    return clients.filter(c => 
      c.name.toLowerCase().includes(name.toLowerCase())
    ).map(this.mapDates);
  }

  async create(data: CreateClientDTO): Promise<Client> {
    const id = await this.storage.add(this.STORE_NAME, data);
    return this.findById(id) as Promise<Client>;
  }

  async update(data: UpdateClientDTO): Promise<Client> {
    const existing = await this.findById(data.id);
    if (!existing) {
      throw new Error('Client not found');
    }

    await this.storage.put(this.STORE_NAME, data);
    return this.findById(data.id) as Promise<Client>;
  }

  async delete(id: number): Promise<boolean> {
    const client = await this.findById(id);
    if (!client) {
      return false;
    }

    await this.storage.delete(this.STORE_NAME, id);
    return true;
  }

  private mapDates(client: any): Client {
    return {
      ...client,
      createdAt: new Date(client.createdAt),
      updatedAt: new Date(client.updatedAt)
    };
  }
}