import { BaseDAO } from './BaseDAO';
import { Client, CreateClientDTO, UpdateClientDTO } from '../models/Client';

export interface ClientDAO extends BaseDAO<Client, CreateClientDTO, UpdateClientDTO> {
  findByEmail(email: string): Promise<Client | null>;
  findByName(name: string): Promise<Client[]>;
}