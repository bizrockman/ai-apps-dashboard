import { ClientDAO } from '../dao/ClientDAO';
import { Client, CreateClientDTO, UpdateClientDTO } from '../models/Client';
import { SQLiteConnection } from './SQLiteConnection';

export class SQLiteClientDAO implements ClientDAO {
  private db = SQLiteConnection.getInstance();

  async findAll(): Promise<Client[]> {
    const stmt = this.db.prepare('SELECT * FROM clients ORDER BY name');
    return stmt.all().map(this.mapToClient);
  }

  async findById(id: number): Promise<Client | null> {
    const stmt = this.db.prepare('SELECT * FROM clients WHERE id = ?');
    const result = stmt.get(id);
    return result ? this.mapToClient(result) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const stmt = this.db.prepare('SELECT * FROM clients WHERE email = ?');
    const result = stmt.get(email);
    return result ? this.mapToClient(result) : null;
  }

  async findByName(name: string): Promise<Client[]> {
    const stmt = this.db.prepare('SELECT * FROM clients WHERE name LIKE ?');
    return stmt.all(`%${name}%`).map(this.mapToClient);
  }

  async create(data: CreateClientDTO): Promise<Client> {
    const stmt = this.db.prepare(
      'INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(data.name, data.email, data.phone, data.address);
    return this.findById(result.lastInsertRowid as number) as Promise<Client>;
  }

  async update(data: UpdateClientDTO): Promise<Client> {
    const fields = Object.keys(data).filter(key => key !== 'id');
    const values = fields.map(field => data[field as keyof UpdateClientDTO]);
    
    const stmt = this.db.prepare(`
      UPDATE clients 
      SET ${fields.map(field => `${field} = ?`).join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...values, data.id);
    return this.findById(data.id) as Promise<Client>;
  }

  async delete(id: number): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM clients WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  private mapToClient(row: any): Client {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}