import { createClient } from '@supabase/supabase-js';
import { ClientDAO } from '../dao/ClientDAO';
import { Client, CreateClientDTO, UpdateClientDTO } from '../models/Client';

export class SupabaseClientDAO implements ClientDAO {
  private supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  async findAll(): Promise<Client[]> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .order('name');

    if (error) throw error;
    return data.map(this.mapToClient);
  }

  async findById(id: number): Promise<Client | null> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapToClient(data);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return null;
    return this.mapToClient(data);
  }

  async findByName(name: string): Promise<Client[]> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .ilike('name', `%${name}%`);

    if (error) throw error;
    return data.map(this.mapToClient);
  }

  async create(data: CreateClientDTO): Promise<Client> {
    const { data: created, error } = await this.supabase
      .from('clients')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return this.mapToClient(created);
  }

  async update(data: UpdateClientDTO): Promise<Client> {
    const { id, ...updateData } = data;
    const { data: updated, error } = await this.supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToClient(updated);
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id);

    return !error;
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