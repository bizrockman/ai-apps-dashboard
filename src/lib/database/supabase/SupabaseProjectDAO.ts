import SupabaseClientSingleton from './SupabaseClient';
import { ProjectDAO } from '../dao/ProjectDAO';
import { Project, CreateProjectDTO, UpdateProjectDTO } from '../models/Project';

export class SupabaseProjectDAO implements ProjectDAO {
  private supabase = SupabaseClientSingleton.getInstance();

  async findAll(): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        contact_persons:project_contact_persons(
          contact_person:contact_persons(*),
          role
        )
      `)
      .order('name');

    if (error) throw error;
    return data.map(this.mapToProject);
  }

  async findById(id: number): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        contact_persons:project_contact_persons(
          contact_person:contact_persons(*),
          role
        )
      `)
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapToProject(data);
  }

  async findByClient(clientId: number): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('name');

    if (error) throw error;
    return data.map(this.mapToProject);
  }

  async findByStatus(status: Project['status']): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('status', status)
      .order('name');

    if (error) throw error;
    return data.map(this.mapToProject);
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

    const { data: created, error } = await this.supabase
      .from('projects')
      .insert([snakeCaseData])
      .select()
      .single();

    if (error) throw error;

    // Add contact persons
    if (data.contactPersonIds?.length) {
      await this.supabase.from('project_contact_persons').insert(
        data.contactPersonIds.map(id => ({
          project_id: created.id,
          contact_person_id: id,
          role: 'contact'
        }))
      );
    }

    // Add project managers
    if (data.projectManagerIds?.length) {
      await this.supabase.from('project_contact_persons').insert(
        data.projectManagerIds.map(id => ({
          project_id: created.id,
          contact_person_id: id,
          role: 'manager'
        }))
      );
    }

    return this.mapToProject(created);
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

    const { data: updated, error } = await this.supabase
      .from('projects')
      .update(snakeCaseData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToProject(updated);
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', id);

    return !error;
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
