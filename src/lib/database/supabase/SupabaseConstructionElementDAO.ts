import { createClient } from '@supabase/supabase-js';
import { ConstructionElementDAO } from '../dao/ConstructionElementDAO';
import { ConstructionElement, CreateConstructionElementDTO, UpdateConstructionElementDTO } from '../models/ConstructionElement';

export class SupabaseConstructionElementDAO implements ConstructionElementDAO {
  private supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  async findAll(): Promise<ConstructionElement[]> {
    const { data, error } = await this.supabase
      .from('construction_elements')
      .select('*')
      .order('name');

    if (error) throw error;
    return data.map(this.mapToConstructionElement);
  }

  async findById(id: number): Promise<ConstructionElement | null> {
    const { data, error } = await this.supabase
      .from('construction_elements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapToConstructionElement(data);
  }

  async findByProject(projectId: number): Promise<ConstructionElement[]> {
    const { data, error } = await this.supabase
      .from('construction_elements')
      .select('*')
      .eq('project_id', projectId)
      .order('name');

    if (error) throw error;
    return data.map(this.mapToConstructionElement);
  }

  async findByCode(code: string): Promise<ConstructionElement | null> {
    const { data, error } = await this.supabase
      .from('construction_elements')
      .select('*')
      .eq('code', code)
      .single();

    if (error) return null;
    return this.mapToConstructionElement(data);
  }

  async create(data: CreateConstructionElementDTO): Promise<ConstructionElement> {
    // Convert camelCase to snake_case for Supabase
    const snakeCaseData = {
      name: data.name,
      description: data.description,
      code: data.code,
      shortcut: data.shortcut,
      project_id: data.projectId
    };

    const { data: created, error } = await this.supabase
      .from('construction_elements')
      .insert([snakeCaseData])
      .select()
      .single();

    if (error) throw error;
    return this.mapToConstructionElement(created);
  }

  async update(data: UpdateConstructionElementDTO): Promise<ConstructionElement> {
    const { id, ...updateData } = data;
    
    // Convert camelCase to snake_case for Supabase
    const snakeCaseData: Record<string, any> = {};
    
    if (updateData.name !== undefined) snakeCaseData.name = updateData.name;
    if (updateData.description !== undefined) snakeCaseData.description = updateData.description;
    if (updateData.code !== undefined) snakeCaseData.code = updateData.code;
    if (updateData.shortcut !== undefined) snakeCaseData.shortcut = updateData.shortcut;
    if (updateData.projectId !== undefined) snakeCaseData.project_id = updateData.projectId;

    const { data: updated, error } = await this.supabase
      .from('construction_elements')
      .update(snakeCaseData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToConstructionElement(updated);
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('construction_elements')
      .delete()
      .eq('id', id);

    return !error;
  }

  private mapToConstructionElement(row: any): ConstructionElement {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      projectId: row.project_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}
