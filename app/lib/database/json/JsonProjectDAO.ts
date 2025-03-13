import { ProjectDAO } from '../dao/ProjectDAO';
import { Project, CreateProjectDTO, UpdateProjectDTO } from '../models/Project';
import { IndexedDBStorage } from '../storage/IndexedDBStorage';

export class JsonProjectDAO implements ProjectDAO {
  private storage = IndexedDBStorage.getInstance();
  private readonly STORE_NAME = 'projects';

  async findAll(): Promise<Project[]> {
    const projects = await this.storage.getAll(this.STORE_NAME);
    return projects.map(this.mapDates);
  }

  async findById(id: number): Promise<Project | null> {
    const project = await this.storage.get(this.STORE_NAME, id);
    return project ? this.mapDates(project) : null;
  }

  async findByClient(clientId: number): Promise<Project[]> {
    const projects = await this.storage.getAll(this.STORE_NAME);
    return projects
      .filter(p => p.clientId === clientId)
      .map(this.mapDates);
  }

  async findByStatus(status: Project['status']): Promise<Project[]> {
    const projects = await this.storage.getAll(this.STORE_NAME);
    return projects
      .filter(p => p.status === status)
      .map(this.mapDates);
  }

  async create(data: CreateProjectDTO): Promise<Project> {
    const code = await this.generateProjectCode();
    const id = await this.storage.add(this.STORE_NAME, { ...data, code });
    return this.findById(id) as Promise<Project>;
  }

  async update(data: UpdateProjectDTO): Promise<Project> {
    const existing = await this.findById(data.id);
    if (!existing) {
      throw new Error('Project not found');
    }

    await this.storage.put(this.STORE_NAME, data);
    return this.findById(data.id) as Promise<Project>;
  }

  async delete(id: number): Promise<boolean> {
    const project = await this.findById(id);
    if (!project) {
      return false;
    }

    await this.storage.delete(this.STORE_NAME, id);
    return true;
  }

  private async generateProjectCode(): Promise<string> {
    const projects = await this.storage.getAll(this.STORE_NAME);
    const nextCode = projects.length + 1;
    return `PRO${String(nextCode).padStart(3, '0')}`;
  }

  private mapDates(project: any): Project {
    return {
      ...project,
      startDate: new Date(project.startDate),
      endDate: project.endDate ? new Date(project.endDate) : undefined,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt)
    };
  }
}