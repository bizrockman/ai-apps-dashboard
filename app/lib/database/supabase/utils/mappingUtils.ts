// src/utils/mappingUtils.ts
import { Client } from '../../models/Client';
import { Project } from '../../models/Project';

export function mapToClient(row: any): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    businessUnit: row.businessUnit,
    street1: row.street1,
    street2: row.street2,
    zipcode: row.zipcode,
    city: row.city,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function mapToProject(row: any): Project {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    clientId: row.clientId,
    contactPerson: row.contactPerson,
    projectManager: row.projectManager,
    status: row.status,
    startDate: new Date(row.start_date),
    endDate: row.end_date ? new Date(row.end_date) : undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
