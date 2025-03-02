import { BaseDAO } from './BaseDAO';
import { ConstructionElement, CreateConstructionElementDTO, UpdateConstructionElementDTO } from '../models/ConstructionElement';

export interface ConstructionElementDAO extends BaseDAO<ConstructionElement, CreateConstructionElementDTO, UpdateConstructionElementDTO> {
  findByProject(projectId: number): Promise<ConstructionElement[]>;
  findByCode(code: string): Promise<ConstructionElement | null>;
}