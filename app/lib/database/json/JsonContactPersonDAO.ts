import { ContactPersonDAO } from '../dao/ContactPersonDAO';
import { ContactPerson, CreateContactPersonDTO, UpdateContactPersonDTO } from '../models/ContactPerson';

// Beispieldaten für Kontaktpersonen
const mockContactPersons: ContactPerson[] = [
  {
    id: 1,
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    phone: '+49 123 456789',
    position: 'Projektleiter',
    company: 'Musterfirma GmbH',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 2,
    firstName: 'Erika',
    lastName: 'Musterfrau',
    email: 'erika.musterfrau@example.com',
    phone: '+49 987 654321',
    position: 'Geschäftsführerin',
    company: 'Musterfirma GmbH',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02')
  }
];

export class JsonContactPersonDAO implements ContactPersonDAO {
  private contactPersons: ContactPerson[] = [...mockContactPersons];

  async findAll(): Promise<ContactPerson[]> {
    return [...this.contactPersons];
  }

  async findById(id: number): Promise<ContactPerson | null> {
    const contactPerson = this.contactPersons.find(cp => cp.id === id);
    return contactPerson ? { ...contactPerson } : null;
  }

  async findByEmail(email: string): Promise<ContactPerson | null> {
    const contactPerson = this.contactPersons.find(cp => cp.email === email);
    return contactPerson ? { ...contactPerson } : null;
  }

  async findByName(name: string): Promise<ContactPerson[]> {
    const searchTerm = name.toLowerCase();
    return this.contactPersons
      .filter(cp => 
        cp.firstName.toLowerCase().includes(searchTerm) || 
        cp.lastName.toLowerCase().includes(searchTerm)
      )
      .map(cp => ({ ...cp }));
  }

  async create(data: CreateContactPersonDTO): Promise<ContactPerson> {
    const newId = Math.max(0, ...this.contactPersons.map(cp => cp.id)) + 1;
    const now = new Date();
    
    const newContactPerson: ContactPerson = {
      id: newId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '',
      position: data.position || '',
      company: data.company || '',
      createdAt: now,
      updatedAt: now
    };
    
    this.contactPersons.push(newContactPerson);
    return { ...newContactPerson };
  }

  async update(data: UpdateContactPersonDTO): Promise<ContactPerson> {
    const index = this.contactPersons.findIndex(cp => cp.id === data.id);
    
    if (index === -1) {
      throw new Error(`Contact person with ID ${data.id} not found`);
    }
    
    const updatedContactPerson = {
      ...this.contactPersons[index],
      ...data,
      updatedAt: new Date()
    };
    
    this.contactPersons[index] = updatedContactPerson;
    return { ...updatedContactPerson };
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.contactPersons.length;
    this.contactPersons = this.contactPersons.filter(cp => cp.id !== id);
    return this.contactPersons.length < initialLength;
  }
} 