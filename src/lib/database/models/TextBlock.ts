export interface TextBlock {
  id: string;
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
  id: string;
}