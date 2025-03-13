import { BaseDAO } from './BaseDAO';
import { ContactPerson, CreateContactPersonDTO, UpdateContactPersonDTO } from '../models/ContactPerson';

export interface ContactPersonDAO extends BaseDAO<ContactPerson, CreateContactPersonDTO, UpdateContactPersonDTO> {
  findByClient(clientId: string): Promise<ContactPerson[]>;
  findByProject(projectId: string): Promise<ContactPerson[]>;
  findByEmail(email: string): Promise<ContactPerson | null>;
}