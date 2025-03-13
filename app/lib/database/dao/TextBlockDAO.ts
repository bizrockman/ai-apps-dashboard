import { BaseDAO } from './BaseDAO';
import { TextBlock, CreateTextBlockDTO, UpdateTextBlockDTO } from '../models/TextBlock';

export interface TextBlockDAO extends BaseDAO<TextBlock, CreateTextBlockDTO, UpdateTextBlockDTO> {
  findByShortcut(shortcut: string): Promise<TextBlock | null>;
}