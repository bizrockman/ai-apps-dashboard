import { ConstructionElementDAO } from '../dao/ConstructionElementDAO';
import { ConstructionElement, CreateConstructionElementDTO, UpdateConstructionElementDTO } from '../models/ConstructionElement';
import ServerSupabaseClient from './ServerSupabaseClient';
import SupabaseClientWrapper from './SupabaseClientWrapper';

// Prüfen, ob wir auf dem Server oder Client sind
const isServer = typeof window === 'undefined';

export class SupabaseConstructionElementDAO implements ConstructionElementDAO {
  // Je nach Umgebung den richtigen Client verwenden
  private supabase = isServer 
    ? ServerSupabaseClient.getInstance() 
    : SupabaseClientWrapper.getInstance();

  async findAll(): Promise<ConstructionElement[]> {
    const { data, error } = await this.supabase
      .from('construction_elements')
      .select(`
        *,
        project:projects(*)
      `)
      .order('name');

    if (error) throw error;
    return data.map(this.mapToConstructionElement);
  }

  async findById(id: number): Promise<ConstructionElement | null> {
    const { data, error } = await this.supabase
      .from('construction_elements')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapToConstructionElement(data);
  }

  async findByProject(projectId: number): Promise<ConstructionElement[]> {
    const { data, error } = await this.supabase
      .from('construction_elements')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('project_id', projectId)
      .order('name');

    if (error) throw error;
    return data.map(this.mapToConstructionElement);
  }

  async findByCode(code: string): Promise<ConstructionElement | null> {
    const { data, error } = await this.supabase
      .from('construction_elements')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('code', code)
      .single();

    if (error) return null;
    return this.mapToConstructionElement(data);
  }

  async create(data: CreateConstructionElementDTO): Promise<ConstructionElement> {
    // Generate a code if not provided
    const code = await this.generateCode();
    
    // Convert camelCase to snake_case for Supabase
    const snakeCaseData = {
      name: data.name,
      code: data.code,
      description: data.description,
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
    // Extract the ID and prepare update data
    const { id, projectId, ...updateData } = data;
    
    // Convert camelCase to snake_case for Supabase
    const snakeCaseData: Record<string, any> = {};
    
    if (updateData.name !== undefined) snakeCaseData.name = updateData.name;
    if (updateData.code !== undefined) snakeCaseData.code = updateData.code;
    if (updateData.description !== undefined) snakeCaseData.description = updateData.description;
    if (updateData.code !== undefined) snakeCaseData.code = updateData.code;
    if (updateData.shortcut !== undefined) snakeCaseData.shortcut = updateData.shortcut;
    if (projectId !== undefined) snakeCaseData.project_id = projectId;
    console.log(snakeCaseData)
    const { data: updated, error } = await this.supabase
      .from('construction_elements')
      .update(snakeCaseData)
      .eq('id', id)
      .select(`
        *,
        project:projects(*)
      `)
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

  private async generateCode(): Promise<string> {
    // Get all existing codes
    const { data: elements } = await this.supabase
      .from('construction_elements')
      .select('code')
      .order('code', { ascending: false })
      .limit(1);

    // Find the highest number and increment
    let nextNumber = 1;
    if (elements && elements.length > 0) {
      const lastCode = elements[0].code;
      const match = lastCode.match(/^BW(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    // Format as BWxxxx where xxxx is padded with zeros
    return `BW${String(nextNumber).padStart(4, '0')}`;
  }

  private mapToConstructionElement(row: any): ConstructionElement {
    return {
      id: row.id,
      code: row.code || '',
      name: row.name,
      description: row.description || '',
      projectId: row.project_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}
