export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  clientId: string;
  costCenter?: string;
  boqNumber?: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  contactPersons?: ContactPerson[];
  projectManagers?: ContactPerson[];
}

export interface CreateProjectDTO {
  name: string;
  description: string;
  clientId: number;
  costCenter?: string;
  boqNumber?: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  contactPersonIds?: string[];
  projectManagerIds?: string[];
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  id: string;
}