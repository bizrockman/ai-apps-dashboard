import SupabaseClientSingleton from './SupabaseClient';
import { ContactPersonDAO } from '../dao/ContactPersonDAO';
import {
  ContactPerson,
  CreateContactPersonDTO,
  UpdateContactPersonDTO,
} from '../models/ContactPerson';
import { mapToClient, mapToProject } from './utils/mappingUtils';

export class SupabaseContactPersonDAO implements ContactPersonDAO {
  private supabase = SupabaseClientSingleton.getInstance();

  async findAll(): Promise<ContactPerson[]> {
    const { data, error } = await this.supabase
      .from('contact_persons')
      .select(`
        *,
        clients:client_contact_persons(
          client:clients(*)
        ),
        projects:project_contact_persons(
          project:projects(*)
        )
      `)
      .order('lastname');

    if (error) throw error;
    return data.map(this.mapToContactPerson);
  }

  async findById(id: string): Promise<ContactPerson | null> {
    const { data, error } = await this.supabase
      .from('contact_persons')
      .select(
        `
        *,
        clients:client_contact_persons(client_id, client:clients(*)),
        projects:project_contact_persons(project_id, project:projects(*))
      `
      )
      .eq('id', id)
      .single();

    if (error) return null;

    return this.mapToContactPerson(data);
  }

  async findByClient(clientId: string): Promise<ContactPerson[]> {
    const { data, error } = await this.supabase
      .from('client_contact_persons')
      .select(`
        contact_person:contact_persons(
          *,
          clients:client_contact_persons(
            client:clients(*)
          ),
          projects:project_contact_persons(
            project:projects(*)
          )
        )
      `)
      .eq('client_id', clientId);

    if (error) throw error;
    return data
      .map(row => row.contact_person)
      .filter((cp): cp is NonNullable<typeof cp> => cp !== null)
      .map(this.mapToContactPerson);
  }

  async findByProject(projectId: string): Promise<ContactPerson[]> {
    const { data, error } = await this.supabase
      .from('contact_persons')
      .select(`
        *,
        clients:client_contact_persons(
          client:clients(*)
        ),
        projects:project_contact_persons(
          project:projects(*)
        )
      `)
      .eq('projects.project_id', projectId);

    if (error) throw error;
    return data.map(this.mapToContactPerson);
  }

  async findByEmail(email: string): Promise<ContactPerson | null> {
    const { data, error } = await this.supabase
      .from('contact_persons')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return null;
    return this.mapToContactPerson(data);
  }

  async create(data: CreateContactPersonDTO): Promise<ContactPerson> {
    const { data: created, error: createError } = await this.supabase
      .from('contact_persons')
      .insert([
        {
          salutation: data.salutation,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phone: data.phone,
        },
      ])
      .select()
      .single();

    if (createError) throw createError;

    // Beziehungen zu Clients hinzufügen
    if (data.clientIds?.length) {
      await this.supabase.from('client_contact_persons').insert(
        data.clientIds.map((clientId) => ({
          client_id: clientId,
          contact_person_id: created.id,
        }))
      );
    }

    // Beziehungen zu Projekten hinzufügen
    if (data.projectIds?.length) {
      await this.supabase.from('project_contact_persons').insert(
        data.projectIds.map((projectId) => ({
          project_id: projectId,
          contact_person_id: created.id,
        }))
      );
    }

    // Versuche das vollständige Objekt mit Relationen zu laden, sonst fallback auf `created`
    return (
      (await this.findById(created.id)) ?? this.mapToContactPerson(created)
    );
  }

  async update(data: UpdateContactPersonDTO): Promise<ContactPerson> {
    const { id, clientIds, projectIds, ...updateData } = data;

    const { data: updated, error } = await this.supabase
      .from('contact_persons')
      .update(updateData)
      .eq('id', id)
      .select()
      .single(); // Stellt sicher, dass das aktualisierte Objekt zurückgegeben wird

    if (error) throw error;

    // Beziehungen zu Clients aktualisieren
    if (clientIds !== undefined) {
      await this.supabase
        .from('client_contact_persons')
        .delete()
        .eq('contact_person_id', id);
      if (clientIds.length) {
        await this.supabase.from('client_contact_persons').insert(
          clientIds.map((clientId) => ({
            client_id: clientId,
            contact_person_id: id,
          }))
        );
      }
    }

    // Beziehungen zu Projekten aktualisieren
    if (projectIds !== undefined) {
      await this.supabase
        .from('project_contact_persons')
        .delete()
        .eq('contact_person_id', id);
      if (projectIds.length) {
        await this.supabase.from('project_contact_persons').insert(
          projectIds.map((projectId) => ({
            project_id: projectId,
            contact_person_id: id,
          }))
        );
      }
    }

    // Versuche das vollständige Objekt mit Relationen zu laden, sonst fallback auf `updated`
    return (await this.findById(id)) ?? this.mapToContactPerson(updated);
  }

  async delete(id: string): Promise<boolean> {
    // The client_contact_persons entries will be automatically deleted due to ON DELETE CASCADE
    const { error } = await this.supabase
      .from('contact_persons')
      .delete()
      .eq('id', id);

    return !error;
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