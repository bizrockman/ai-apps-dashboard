'use client';

import { ProjectDAO } from '../dao/ProjectDAO';
import { Project, CreateProjectDTO, UpdateProjectDTO } from '../models/Project';
import ServerSupabaseClient from './ServerSupabaseClient';
import SupabaseClientWrapper from './SupabaseClientWrapper';

// Prüfen, ob wir auf dem Server oder Client sind
const isServer = typeof window === 'undefined';

export class SupabaseProjectDAO implements ProjectDAO {
  // Je nach Umgebung den richtigen Client verwenden
  private supabase = isServer 
    ? ServerSupabaseClient.getInstance() 
    : SupabaseClientWrapper.getInstance();

  async findAll(): Promise<Project[]> {
    try {
      const response = await this.supabase.query('projects', {
        select: `
          *,
          contact_persons:project_contact_persons(
            contact_person:contact_persons(*),
            role
          )
        `,
        orderBy: 'name'
      });
      
      if (!response.data) throw new Error('No data returned');
      return response.data.map(this.mapToProject);
    } catch (error) {
      console.error('Error finding all projects:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Project | null> {
    try {
      const response = await this.supabase.query('projects', {
        select: `
          *,
          contact_persons:project_contact_persons(
            contact_person:contact_persons(*),
            role
          )
        `,
        filters: { id }
      });
      
      if (!response.data || response.data.length === 0) return null;
      return this.mapToProject(response.data[0]);
    } catch (error) {
      console.error(`Error finding project by ID ${id}:`, error);
      return null;
    }
  }

  async findByClient(clientId: number): Promise<Project[]> {
    try {
      const response = await this.supabase.query('projects', {
        select: '*',
        filters: { client_id: clientId },
        orderBy: 'name'
      });
      
      if (!response.data) throw new Error('No data returned');
      return response.data.map(this.mapToProject);
    } catch (error) {
      console.error(`Error finding projects by client ID ${clientId}:`, error);
      throw error;
    }
  }

  async findByStatus(status: Project['status']): Promise<Project[]> {
    try {
      const response = await this.supabase.query('projects', {
        select: '*',
        filters: { status },
        orderBy: 'name'
      });
      
      if (!response.data) throw new Error('No data returned');
      return response.data.map(this.mapToProject);
    } catch (error) {
      console.error(`Error finding projects by status ${status}:`, error);
      throw error;
    }
  }

  async create(data: CreateProjectDTO): Promise<Project> {
    const snakeCaseData = {
      name: data.name,
      description: data.description,
      client_id: data.clientId,
      cost_center: data.costCenter,
      boq_number: data.boqNumber,
      contact_person: data.contactPerson,
      project_manager: data.projectManager,
      status: data.status,
      // Generate a unique code based on name if not provided
      code: data.name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    };

    try {
      const response = await this.supabase.create('projects', snakeCaseData);
      
      if (!response.data) throw new Error('No data returned');
      const created = response.data;

      // Add contact persons
      if (data.contactPersonIds?.length) {
        await Promise.all(data.contactPersonIds.map(id => 
          this.supabase.create('project_contact_persons', {
            project_id: created.id,
            contact_person_id: id,
            role: 'contact'
          })
        ));
      }

      // Add project managers
      if (data.projectManagerIds?.length) {
        await Promise.all(data.projectManagerIds.map(id => 
          this.supabase.create('project_contact_persons', {
            project_id: created.id,
            contact_person_id: id,
            role: 'manager'
          })
        ));
      }

      return this.mapToProject(created);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async update(data: UpdateProjectDTO): Promise<Project> {
    const { id, ...updateData } = data;
    
    // Convert camelCase to snake_case for Supabase
    const snakeCaseData: Record<string, any> = {};
    
    if (updateData.name !== undefined) snakeCaseData.name = updateData.name;
    if (updateData.description !== undefined) snakeCaseData.description = updateData.description;
    if (updateData.clientId !== undefined) snakeCaseData.client_id = updateData.clientId;
    if (updateData.contactPerson !== undefined) snakeCaseData.contact_person = updateData.contactPerson;
    if (updateData.projectManager !== undefined) snakeCaseData.project_manager = updateData.projectManager;
    if (updateData.status !== undefined) snakeCaseData.status = updateData.status;
    if (updateData.startDate !== undefined) snakeCaseData.start_date = updateData.startDate;
    if (updateData.endDate !== undefined) snakeCaseData.end_date = updateData.endDate;

    try {
      const response = await this.supabase.update('projects', id.toString(), snakeCaseData);
      
      if (!response.data) throw new Error('No data returned');
      return this.mapToProject(response.data);
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.supabase.delete('projects', id.toString());
      return true;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      return false;
    }
  }

  private mapToProject(row: any): Project {
    // Filter contact persons by role
    const contactPersons = row.contact_persons
      ? row.contact_persons
          .filter(cp => cp.role === 'contact')
          .map(cp => cp.contact_person)
      : [];

    const projectManagers = row.contact_persons
      ? row.contact_persons
          .filter(cp => cp.role === 'manager')
          .map(cp => cp.contact_person)
      : [];

    return {
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      clientId: row.client_id,
      costCenter: row.cost_center,
      boqNumber: row.boq_number,
      status: row.status as Project['status'],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      contactPersons,
      projectManagers
    };
  }
}
