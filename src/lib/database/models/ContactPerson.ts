import { Client } from './Client';
import { Project } from './Project';

export interface ContactPerson {
  id: string;
  salutation: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  clients: Client[];
  projects: Project[];
}

export interface CreateContactPersonDTO {
  salutation: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  clientIds?: string[]; // Array with 0 or 1 client ID initially
  projectIds?: string[];
}

export interface UpdateContactPersonDTO
  extends Partial<CreateContactPersonDTO> {
  }
  id: string;
