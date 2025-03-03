import SupabaseClientSingleton from './SupabaseClient';
import { TextBlockDAO } from '../dao/TextBlockDAO';
import { TextBlock, CreateTextBlockDTO, UpdateTextBlockDTO } from '../models/TextBlock';

export class SupabaseTextBlockDAO implements TextBlockDAO {
  private supabase = SupabaseClientSingleton.getInstance();

  async findAll(): Promise<TextBlock[]> {
    const { data, error } = await this.supabase
      .from('text_blocks')
      .select('*')
      .order('name');

    if (error) throw error;
    return data.map(this.mapToTextBlock);
  }

  async findById(id: string): Promise<TextBlock | null> {
    const { data, error } = await this.supabase
      .from('text_blocks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapToTextBlock(data);
  }

  async findByShortcut(shortcut: string): Promise<TextBlock | null> {
    const { data, error } = await this.supabase
      .from('text_blocks')
      .select('*')
      .eq('shortcut', shortcut)
      .single();

    if (error) return null;
    return this.mapToTextBlock(data);
  }

  async create(data: CreateTextBlockDTO): Promise<TextBlock> {
    const { data: created, error } = await this.supabase
      .from('text_blocks')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return this.mapToTextBlock(created);
  }

  async update(data: UpdateTextBlockDTO): Promise<TextBlock> {
    const { id, ...updateData } = data;

    const { data: updated, error } = await this.supabase
      .from('text_blocks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToTextBlock(updated);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('text_blocks')
      .delete()
      .eq('id', id);

    return !error;
  }

  private mapToTextBlock(row: any): TextBlock {
    return {
      id: row.id,
      shortcut: row.shortcut,
      name: row.name,
      content: row.content,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}
