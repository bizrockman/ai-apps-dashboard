export interface TextBlock {
  id: number;
  shortcut: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTextBlockDTO {
  shortcut: string;
  name: string;
  content: string;
}

export interface UpdateTextBlockDTO extends Partial<CreateTextBlockDTO> {
  id: number;
}