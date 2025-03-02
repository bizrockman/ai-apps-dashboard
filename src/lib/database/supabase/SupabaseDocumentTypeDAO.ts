import { createClient } from '@supabase/supabase-js';
import { DocumentTypeDAO } from '../dao/DocumentTypeDAO';
import { DocumentType, CreateDocumentTypeDTO, UpdateDocumentTypeDTO, CreateDocumentTypeBlockDTO, DocumentTypeBlock } from '../models/DocumentType';

export class SupabaseDocumentTypeDAO implements DocumentTypeDAO {
  private supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  async findAll(): Promise<DocumentType[]> {
    const { data, error } = await this.supabase
      .from('document_types')
      .select(`
        *,
        document_type_blocks(*)
      `)
      .order('name');

    if (error) throw error;
    return data.map(this.mapToDocumentType);
  }

  async findById(id: number): Promise<DocumentType | null> {
    const { data, error } = await this.supabase
      .from('document_types')
      .select(`
        *,
        document_type_blocks(*)
      `)
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapToDocumentType(data);
  }

  async create(data: CreateDocumentTypeDTO): Promise<DocumentType> {
    const { data: created, error } = await this.supabase
      .from('document_types')
      .insert([data])
      .select(`
        *,
        document_type_blocks(*)
      `)
      .single();

    if (error) throw error;
    return this.mapToDocumentType(created);
  }

  async update(data: UpdateDocumentTypeDTO): Promise<DocumentType> {
    const { id, ...updateData } = data;

    const { data: updated, error } = await this.supabase
      .from('document_types')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        document_type_blocks(*)
      `)
      .single();

    if (error) throw error;
    return this.mapToDocumentType(updated);
  }

  async delete(id: number): Promise<boolean> {
    // Note: Blocks will be automatically deleted due to ON DELETE CASCADE
    const { error } = await this.supabase
      .from('document_types')
      .delete()
      .eq('id', id);

    return !error;
  }

  async addBlock(data: CreateDocumentTypeBlockDTO): Promise<void> {
    // Convert camelCase to snake_case for Supabase
    const snakeCaseData = {
      document_type_id: data.documentTypeId,
      text_block_id: data.textBlockId,
      order: data.order,
      input_label: data.inputLabel,
      input_type: data.inputType,
      required: data.required
    };

    const { error } = await this.supabase
      .from('document_type_blocks')
      .insert([snakeCaseData]);

    if (error) throw error;
  }

  async removeBlock(documentTypeId: number, blockId: number): Promise<void> {
    const { error } = await this.supabase
      .from('document_type_blocks')
      .delete()
      .eq('id', blockId)
      .eq('document_type_id', documentTypeId);

    if (error) throw error;
  }

  async reorderBlocks(documentTypeId: number, blockIds: number[]): Promise<void> {
    // Create a transaction to update all blocks in order
    const updates = blockIds.map((blockId, index) => {
      return this.supabase
        .from('document_type_blocks')
        .update({ order: index })
        .eq('id', blockId)
        .eq('document_type_id', documentTypeId);
    });

    // Execute all updates
    await Promise.all(updates);
  }

  private mapToDocumentType(row: any): DocumentType {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      blocks: row.document_type_blocks ? row.document_type_blocks.map(this.mapToDocumentTypeBlock) : [],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapToDocumentTypeBlock(row: any): DocumentTypeBlock {
    return {
      id: row.id,
      documentTypeId: row.document_type_id,
      textBlockId: row.text_block_id,
      order: row.order,
      inputLabel: row.input_label,
      inputType: row.input_type as DocumentTypeBlock['inputType'],
      required: row.required
    };
  }
}
