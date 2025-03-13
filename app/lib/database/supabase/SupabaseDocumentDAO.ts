import { DocumentDAO } from '../dao/DocumentDAO';
import { Document, CreateDocumentDTO, UpdateDocumentDTO } from '../models/Document';
import ServerSupabaseClient from './ServerSupabaseClient';
import SupabaseClientWrapper from './SupabaseClientWrapper';

// Prüfen, ob wir auf dem Server oder Client sind
const isServer = typeof window === 'undefined';

export class SupabaseDocumentDAO implements DocumentDAO {
  // Je nach Umgebung den richtigen Client verwenden
  private supabase = isServer 
    ? ServerSupabaseClient.getInstance() 
    : SupabaseClientWrapper.getInstance();

  async findAll(): Promise<Document[]> {
    const { data, error } = await this.supabase
      .from('documents')
      .select('*')
      .order('title');

    if (error) throw error;
    return data.map(this.mapToDocument);
  }

  async findById(id: string): Promise<Document | null> {
    const { data, error } = await this.supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapToDocument(data);
  }

  async findByProject(projectId: number): Promise<Document[]> {
    const { data, error } = await this.supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .order('title');

    if (error) throw error;
    return data.map(this.mapToDocument);
  }

  async findByType(typeId: number): Promise<Document[]> {
    const { data, error } = await this.supabase
      .from('documents')
      .select('*')
      .eq('type_id', typeId)
      .order('title');

    if (error) throw error;
    return data.map(this.mapToDocument);
  }

  async findByStatus(status: Document['status']): Promise<Document[]> {
    const { data, error } = await this.supabase
      .from('documents')
      .select('*')
      .eq('status', status)
      .order('title');

    if (error) throw error;
    return data.map(this.mapToDocument);
  }

  async create(data: CreateDocumentDTO): Promise<Document> {
    console.log('Creating document:', data);
    // Convert camelCase to snake_case for Supabase
    const snakeCaseData = {
      title: data.title,
      content: data.content,
      project_id: data.projectId,
      type_id: data.typeId,
      element_id: data.elementId,
      status: data.status,      
      pdf_content: data.pdfContent,
      pdf_generated_at: data.pdfGeneratedAt
    };

    const { data: created, error } = await this.supabase
      .from('documents')
      .insert([snakeCaseData])
      .select()
      .single();

    if (error) throw error;
    return this.mapToDocument(created);
  }

  async update(data: UpdateDocumentDTO): Promise<Document> {
    const { id, ...updateData } = data;
    
    // Convert camelCase to snake_case for Supabase
    const snakeCaseData: Record<string, any> = {};
    
    if (updateData.title !== undefined) snakeCaseData.title = updateData.title;
    if (updateData.content !== undefined) snakeCaseData.content = updateData.content;
    if (updateData.projectId !== undefined) snakeCaseData.project_id = updateData.projectId;
    if (updateData.typeId !== undefined) snakeCaseData.type_id = updateData.typeId;
    if (updateData.elementId !== undefined) snakeCaseData.element_id = updateData.elementId;
    if (updateData.status !== undefined) snakeCaseData.status = updateData.status;
    if (updateData.pdfContent !== undefined) snakeCaseData.pdf_content = updateData.pdfContent;
    if (updateData.pdfGeneratedAt !== undefined) snakeCaseData.pdf_generated_at = updateData.pdfGeneratedAt;
    if (updateData.pdfFileName !== undefined) snakeCaseData.pdf_file_name = updateData.pdfFileName;
    
    const { data: updated, error } = await this.supabase
      .from('documents')
      .update(snakeCaseData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToDocument(updated);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('documents')
      .delete()
      .eq('id', id);

    return !error;
  }

  private mapToDocument(row: any): Document {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      projectId: row.project_id,
      typeId: row.type_id,
      elementId: row.element_id,
      status: row.status as Document['status'],      
      pdfContent: row.pdf_content,
      pdfFileName: row.pdf_file_name,
      pdfGeneratedAt: row.pdf_generated_at ? new Date(row.pdf_generated_at) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}
