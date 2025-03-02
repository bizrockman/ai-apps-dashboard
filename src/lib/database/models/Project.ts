export interface Project {
  id: number;
  code: string;
  name: string;
  description: string;
  clientId: number;
  contactPerson: string;
  projectManager: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDTO {
  name: string;
  description: string;
  clientId: number;
  contactPerson: string;
  projectManager: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  id: number;
}