export interface ConstructionElement {
  id: string;
  code: string;
  name: string;
  description: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConstructionElementDTO {
  name: string;
  description: string;
  code: string;
  shortcut: string;
  projectId: number;
}

export interface UpdateConstructionElementDTO extends Partial<CreateConstructionElementDTO> {
  id: string;
}