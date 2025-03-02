export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientDTO {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateClientDTO extends Partial<CreateClientDTO> {
  id: number;
}