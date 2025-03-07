import SupabaseClientSingleton from './SupabaseClient';
import { ClientDAO } from '../dao/ClientDAO';
import { Client, CreateClientDTO, UpdateClientDTO } from '../models/Client';

export class SupabaseClientDAO implements ClientDAO {
  private supabase = SupabaseClientSingleton.getInstance();

  async findAll(): Promise<Client[]> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .order('name');

    if (error) throw error;
    return data.map(this.mapToClient);
  }

  async findById(id: string): Promise<Client | null> {
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
    const snakeCaseData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      business_unit: data.businessUnit,
      street_1: data.street1,
      street_2: data.street2,
      zipcode: data.zipcode,
      city: data.city
    };

    const { data: created, error } = await this.supabase
    .from('clients')
    .insert([snakeCaseData])
    .select()
    .single();

    if (error) throw error;
    return this.mapToClient(created);
  }

  async update(data: UpdateClientDTO): Promise<Client> {
    const { id, ...updateData } = data;
    
    // Convert camelCase to snake_case for Supabase
    const snakeCaseData: Record<string, any> = {};
      
    if (updateData.name !== undefined) snakeCaseData.name = updateData.name;
    if (updateData.email !== undefined) snakeCaseData.email = updateData.email;
    if (updateData.phone !== undefined) snakeCaseData.phone = updateData.phone;
    if (updateData.businessUnit !== undefined) snakeCaseData.business_unit = updateData.businessUnit;
    if (updateData.street1 !== undefined) snakeCaseData.street_1 = updateData.street1;
    if (updateData.street2 !== undefined) snakeCaseData.street_2 = updateData.street2;
    if (updateData.zipcode !== undefined) snakeCaseData.zipcode = updateData.zipcode;
    if (updateData.city !== undefined) snakeCaseData.city = updateData.city;


    const { data: updated, error } = await this.supabase
      .from('clients')
      .update(snakeCaseData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToClient(updated);
  }

  async delete(id: string): Promise<boolean> {
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
      businessUnit: row.business_unit,
      street1: row.street_1,
      street2: row.street_2,
      zipcode: row.zipcode,
      city: row.city,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}