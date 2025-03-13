import { User } from '../../types';
import { Project } from '../database/models/Project';
import { ContactPerson } from '../database/models/ContactPerson';

// Definiere einen flexibleren User-Typ für die DocumentFilter-Klasse
interface FilterUser {
  id: string;
  username?: string;
  email?: string;
  displayName?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
}

export class DocumentFilter {
  private user: FilterUser;
  private project?: Project;
  private contactPersons: ContactPerson[];

  constructor(user: FilterUser, project?: Project, contactPersons: ContactPerson[] = []) {
    this.user = user;
    this.project = project;
    this.contactPersons = contactPersons;
  }

  public async processContent(content: string): Promise<string> {
    let processedContent = content;

    // Replace user placeholders
    processedContent = this.replaceUserPlaceholders(processedContent);

    // Replace project contact persons
    if (this.project && this.contactPersons.length > 0) {
      processedContent = this.replaceContactPersonsPlaceholders(processedContent);
    }

    return processedContent;
  }

  public userSign(): string {
    // Get first character of firstname and lastname
    const firstInitial = this.user.firstname?.charAt(0).toUpperCase() || '';
    const lastInitial = this.user.lastname?.charAt(0).toUpperCase() || '';
    
    // Combine them
    return `${firstInitial}${lastInitial}`;
  }

  private replaceUserPlaceholders(content: string): string {
    let result = content;

    // Replace individual placeholders
    result = result.replace(/{user\.lastname}/g, this.user.lastname?.split('').join(' ').toUpperCase() || '');
    result = result.replace(/{user\.firstname}/g, this.user.firstname || '');
    result = result.replace(/{user\.sign}/g, this.userSign);

    // Replace combined name placeholder
    result = result.replace(
      /{user\.firstname} {user\.lastname}/g,
      `${this.user.firstname} ${this.user.lastname?.split('').join(' ').toUpperCase() || ''}`
    );

    return result;
  }

  private replaceContactPersonsPlaceholders(content: string): string {
    if (!this.project || this.contactPersons.length === 0) return content;

    const salutationMap = {
      'Frau': 'sehr geehrte',
      'Herr': 'sehr geehrter'
    };

    let result = content;
    const placeholder = '{project.ansprechpartner}';

    if (result.includes(placeholder)) {
      const greetings = this.contactPersons.map(person => {
        const salutation = salutationMap[person.salutation as keyof typeof salutationMap] || 'sehr geehrte/r';
        return `${salutation} ${person.salutation} ${person.firstname}${person.lastname}`;
      });

      // Join greetings with commas and 'und' for the last one if multiple
      let replacement = '';
      if (greetings.length === 1) {
        replacement = greetings[0];
      } else if (greetings.length > 1) {
        const lastGreeting = greetings.pop();
        replacement = `${greetings.join('\n')},\n${lastGreeting}`;
      }

      result = result.replace(placeholder, replacement);
    }

    return result;
  }
}