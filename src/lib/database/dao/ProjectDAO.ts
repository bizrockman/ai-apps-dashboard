import { BaseDAO } from './BaseDAO';
import { Project, CreateProjectDTO, UpdateProjectDTO } from '../models/Project';

export interface ProjectDAO extends BaseDAO<Project, CreateProjectDTO, UpdateProjectDTO> {
  findByClient(clientId: number): Promise<Project[]>;
  findByStatus(status: Project['status']): Promise<Project[]>;
}