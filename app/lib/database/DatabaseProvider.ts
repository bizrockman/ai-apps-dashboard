import { ClientDAO } from './dao/ClientDAO';
import { ProjectDAO } from './dao/ProjectDAO';
import { ConstructionElementDAO } from './dao/ConstructionElementDAO';
import { DocumentTypeDAO } from './dao/DocumentTypeDAO';
import { DocumentDAO } from './dao/DocumentDAO';
import { TextBlockDAO } from './dao/TextBlockDAO';
import { ContactPersonDAO } from './dao/ContactPersonDAO';

// Importiere die lokale Version der SupabaseClientDAO
import { SupabaseClientDAO } from './supabase/SupabaseClientDAO';

// Importiere die DAOs aus dem src/lib/database/supabase Verzeichnis
import { SupabaseProjectDAO } from '../../../src/lib/database/supabase/SupabaseProjectDAO';
import { SupabaseConstructionElementDAO } from '../../../src/lib/database/supabase/SupabaseConstructionElementDAO';
import { SupabaseDocumentTypeDAO } from '../../../src/lib/database/supabase/SupabaseDocumentTypeDAO';
import { SupabaseDocumentDAO } from '../../../src/lib/database/supabase/SupabaseDocumentDAO';
import { SupabaseTextBlockDAO } from '../../../src/lib/database/supabase/SupabaseTextBlockDAO';
import { SupabaseContactPersonDAO } from '../../../src/lib/database/supabase/SupabaseContactPersonDAO';

/**
 * Der DatabaseProvider stellt DAOs für den Zugriff auf die Datenbank bereit.
 * Diese Klasse wird nur auf dem Server verwendet.
 */
export class DatabaseProvider {
  private static instance: DatabaseProvider | null = null;
  private clientDAO!: ClientDAO;
  private projectDAO!: ProjectDAO;
  private constructionElementDAO!: ConstructionElementDAO;
  private documentTypeDAO!: DocumentTypeDAO;
  private documentDAO!: DocumentDAO;
  private textBlockDAO!: TextBlockDAO;
  private contactPersonDAO!: ContactPersonDAO;
  private isServer: boolean;

  private constructor() {
    // Prüfen, ob wir auf dem Server sind
    this.isServer = typeof window === 'undefined';
    
    if (!this.isServer) {
      console.error('DatabaseProvider sollte nur auf dem Server verwendet werden. Verwende im Client die API-Services.');
    }
    
    // Wir verwenden immer Supabase-DAOs
    this.setImplementation('supabase');
  }

  public static getInstance(): DatabaseProvider {
    if (!DatabaseProvider.instance) {
      DatabaseProvider.instance = new DatabaseProvider();
    }
    return DatabaseProvider.instance;
  }

  public getClientDAO(): ClientDAO {
    this.checkServerEnvironment();
    return this.clientDAO;
  }

  public getProjectDAO(): ProjectDAO {
    this.checkServerEnvironment();
    return this.projectDAO;
  }

  public getConstructionElementDAO(): ConstructionElementDAO {
    this.checkServerEnvironment();
    return this.constructionElementDAO;
  }

  public getDocumentTypeDAO(): DocumentTypeDAO {
    this.checkServerEnvironment();
    return this.documentTypeDAO;
  }

  public getDocumentDAO(): DocumentDAO {
    this.checkServerEnvironment();
    return this.documentDAO;
  }

  public getTextBlockDAO(): TextBlockDAO {
    this.checkServerEnvironment();
    return this.textBlockDAO;
  }

  public getContactPersonDAO(): ContactPersonDAO {
    this.checkServerEnvironment();
    return this.contactPersonDAO;
  }

  /**
   * Prüft, ob wir auf dem Server sind und wirft einen Fehler, wenn nicht
   */
  private checkServerEnvironment(): void {
    if (!this.isServer) {
      throw new Error('DatabaseProvider kann nur auf dem Server verwendet werden. Verwende im Client die API-Services.');
    }
  }

  // Method to switch database implementations
  public setImplementation(implementation: 'supabase') {
    // Wir müssen sicherstellen, dass wir auf dem Server sind
    if (!this.isServer) {
      throw new Error('DatabaseProvider kann nur auf dem Server verwendet werden. Verwende im Client die API-Services.');
    }

    switch (implementation) {
      case 'supabase':
        try {
          // Wir verwenden die DAOs aus dem src/lib/database/supabase Verzeichnis
          this.clientDAO = new SupabaseClientDAO();
          this.projectDAO = new SupabaseProjectDAO();
          this.constructionElementDAO = new SupabaseConstructionElementDAO();
          this.documentTypeDAO = new SupabaseDocumentTypeDAO();
          this.documentDAO = new SupabaseDocumentDAO();
          this.textBlockDAO = new SupabaseTextBlockDAO();
          this.contactPersonDAO = new SupabaseContactPersonDAO();
          
        } catch (error) {
          console.error('Fehler beim Initialisieren der DAOs:', error);
          throw error;
        }
        break;
      default:
        throw new Error(`Database implementation ${implementation} not supported`);
    }
  }
}
