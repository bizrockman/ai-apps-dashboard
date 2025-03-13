export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessUnit: string;
  street1: string;
  street2: string;
  zipcode: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientDTO {
  name: string;
  email: string;
  phone: string;
  businessUnit: string;
  street1: string;
  street2: string;
  zipcode: string;
  city: string;
}

export interface UpdateClientDTO extends Partial<CreateClientDTO> {
  id: string;
}