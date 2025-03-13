'use client';

import { ContactPersonDAO } from '../dao/ContactPersonDAO';
import { ContactPerson, CreateContactPersonDTO, UpdateContactPersonDTO } from '../models/ContactPerson';
import ServerSupabaseClient from './ServerSupabaseClient';
import SupabaseClientWrapper from './SupabaseClientWrapper';
import { mapToClient, mapToProject } from './utils/mappingUtils';

// Prüfen, ob wir auf dem Server oder Client sind
const isServer = typeof window === 'undefined';

export class SupabaseContactPersonDAO implements ContactPersonDAO {
  // Je nach Umgebung den richtigen Client verwenden
  private supabase = isServer 
    ? ServerSupabaseClient.getInstance() 
    : SupabaseClientWrapper.getInstance();

  async findAll(): Promise<ContactPerson[]> {
    try {
      const response = await this.supabase.query('contact_persons', {
        select: `
          *,
          clients:client_contact_persons(
            client:clients(*)
          ),
          projects:project_contact_persons(
            project:projects(*)
          )
        `,
        orderBy: 'lastname'
      });
      
      if (!response.data) throw new Error('No data returned');
      return response.data.map(this.mapToContactPerson);
    } catch (error) {
      console.error('Error finding all contact persons:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<ContactPerson | null> {
    try {
      const response = await this.supabase.query('contact_persons', {
        select: `
          *,
          clients:client_contact_persons(client_id, client:clients(*)),
          projects:project_contact_persons(project_id, project:projects(*))
        `,
        filters: { id }
      });
      
      if (!response.data || response.data.length === 0) return null;
      return this.mapToContactPerson(response.data[0]);
    } catch (error) {
      console.error(`Error finding contact person by ID ${id}:`, error);
      return null;
    }
  }

  async findByClient(clientId: string): Promise<ContactPerson[]> {
    try {
      const response = await this.supabase.query('client_contact_persons', {
        select: `
          contact_person:contact_persons(
            *,
            clients:client_contact_persons(
              client:clients(*)
            ),
            projects:project_contact_persons(
              project:projects(*)
            )
          )
        `,
        filters: { client_id: clientId }
      });
      
      if (!response.data) throw new Error('No data returned');
      return response.data
        .map(row => row.contact_person)
        .filter((cp): cp is NonNullable<typeof cp> => cp !== null)
        .map(this.mapToContactPerson);
    } catch (error) {
      console.error(`Error finding contact persons by client ID ${clientId}:`, error);
      throw error;
    }
  }

  async findByProject(projectId: string): Promise<ContactPerson[]> {
    try {
      // Diese Abfrage ist komplexer und kann möglicherweise nicht direkt mit dem Wrapper umgesetzt werden
      // Wir verwenden eine einfachere Abfrage und filtern dann auf der Client-Seite
      const response = await this.supabase.query('project_contact_persons', {
        select: `
          contact_person:contact_persons(
            *,
            clients:client_contact_persons(
              client:clients(*)
            ),
            projects:project_contact_persons(
              project:projects(*)
            )
          )
        `,
        filters: { project_id: projectId }
      });
      
      if (!response.data) throw new Error('No data returned');
      return response.data
        .map(row => row.contact_person)
        .filter((cp): cp is NonNullable<typeof cp> => cp !== null)
        .map(this.mapToContactPerson);
    } catch (error) {
      console.error(`Error finding contact persons by project ID ${projectId}:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<ContactPerson | null> {
    try {
      const response = await this.supabase.query('contact_persons', {
        select: '*',
        filters: { email }
      });
      
      if (!response.data || response.data.length === 0) return null;
      return this.mapToContactPerson(response.data[0]);
    } catch (error) {
      console.error(`Error finding contact person by email ${email}:`, error);
      return null;
    }
  }

  async create(data: CreateContactPersonDTO): Promise<ContactPerson> {
    try {
      const createData = {
        salutation: data.salutation,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
      };
      
      const response = await this.supabase.create('contact_persons', createData);
      
      if (!response.data) throw new Error('No data returned');
      const created = response.data;

      // Beziehungen zu Clients hinzufügen
      if (data.clientIds?.length) {
        await Promise.all(data.clientIds.map(clientId => 
          this.supabase.create('client_contact_persons', {
            client_id: clientId,
            contact_person_id: created.id,
          })
        ));
      }

      // Beziehungen zu Projekten hinzufügen
      if (data.projectIds?.length) {
        await Promise.all(data.projectIds.map(projectId => 
          this.supabase.create('project_contact_persons', {
            project_id: projectId,
            contact_person_id: created.id,
          })
        ));
      }

      // Versuche das vollständige Objekt mit Relationen zu laden, sonst fallback auf `created`
      const fullContactPerson = await this.findById(created.id);
      return fullContactPerson ?? this.mapToContactPerson(created);
    } catch (error) {
      console.error('Error creating contact person:', error);
      throw error;
    }
  }

  async update(data: UpdateContactPersonDTO): Promise<ContactPerson> {
    try {
      const { id, clientIds, projectIds, ...updateData } = data;

      const response = await this.supabase.update('contact_persons', id, updateData);
      
      if (!response.data) throw new Error('No data returned');
      const updated = response.data;

      // Beziehungen zu Clients aktualisieren
      if (clientIds !== undefined) {
        // Löschen der bestehenden Beziehungen
        await this.supabase.mutation('client_contact_persons', 'delete', null, {
          contact_person_id: id
        });
        
        // Hinzufügen der neuen Beziehungen
        if (clientIds.length) {
          await Promise.all(clientIds.map(clientId => 
            this.supabase.create('client_contact_persons', {
              client_id: clientId,
              contact_person_id: id,
            })
          ));
        }
      }

      // Beziehungen zu Projekten aktualisieren
      if (projectIds !== undefined) {
        // Löschen der bestehenden Beziehungen
        await this.supabase.mutation('project_contact_persons', 'delete', null, {
          contact_person_id: id
        });
        
        // Hinzufügen der neuen Beziehungen
        if (projectIds.length) {
          await Promise.all(projectIds.map(projectId => 
            this.supabase.create('project_contact_persons', {
              project_id: projectId,
              contact_person_id: id,
            })
          ));
        }
      }

      // Versuche das vollständige Objekt mit Relationen zu laden, sonst fallback auf `updated`
      const fullContactPerson = await this.findById(id);
      return fullContactPerson ?? this.mapToContactPerson(updated);
    } catch (error) {
      console.error(`Error updating contact person ${data.id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.supabase.delete('contact_persons', id);
      return true;
    } catch (error) {
      console.error(`Error deleting contact person ${id}:`, error);
      return false;
    }
  }

  private mapToContactPerson(row: any): ContactPerson {
    return {
      id: row.id,
      salutation: row.salutation || '',
      firstname: row.firstname,
      lastname: row.lastname,
      email: row.email,
      phone: row.phone,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      clients: row.clients
        ? row.clients
            .filter((c: any) => c.client) // Filter out null clients
            .map((c: any) => mapToClient(c.client))
        : [],
      projects: row.projects
        ? row.projects
            .filter((p: any) => p.project) // Filter out null projects
            .map((p: any) => mapToProject(p.project))
        : [],
    };
  }
}