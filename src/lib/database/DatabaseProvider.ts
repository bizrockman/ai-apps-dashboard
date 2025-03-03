import { ClientDAO } from './dao/ClientDAO';
import { ProjectDAO } from './dao/ProjectDAO';
import { ConstructionElementDAO } from './dao/ConstructionElementDAO';
import { DocumentTypeDAO } from './dao/DocumentTypeDAO';
import { DocumentDAO } from './dao/DocumentDAO';
import { TextBlockDAO } from './dao/TextBlockDAO';
import { JsonClientDAO } from './json/JsonClientDAO';
import { JsonProjectDAO } from './json/JsonProjectDAO';
import { JsonConstructionElementDAO } from './json/JsonConstructionElementDAO';
import { JsonDocumentTypeDAO } from './json/JsonDocumentTypeDAO';
import { JsonDocumentDAO } from './json/JsonDocumentDAO';
import { JsonTextBlockDAO } from './json/JsonTextBlockDAO';
import { SupabaseClientDAO } from './supabase/SupabaseClientDAO';
import { SupabaseProjectDAO } from './supabase/SupabaseProjectDAO';
import { SupabaseConstructionElementDAO } from './supabase/SupabaseConstructionElementDAO';
import { SupabaseDocumentTypeDAO } from './supabase/SupabaseDocumentTypeDAO';
import { SupabaseDocumentDAO } from './supabase/SupabaseDocumentDAO';
import { SupabaseTextBlockDAO } from './supabase/SupabaseTextBlockDAO';

export class DatabaseProvider {
  private static instance: DatabaseProvider | null = null;
  private clientDAO!: ClientDAO;
  private projectDAO!: ProjectDAO;
  private constructionElementDAO!: ConstructionElementDAO;
  private documentTypeDAO!: DocumentTypeDAO;
  private documentDAO!: DocumentDAO;
  private textBlockDAO!: TextBlockDAO;

  private constructor() {
    this.setImplementation('supabase');
  }

  public static getInstance(): DatabaseProvider {
    if (!DatabaseProvider.instance) {
      DatabaseProvider.instance = new DatabaseProvider();
    }
    return DatabaseProvider.instance;
  }

  public getClientDAO(): ClientDAO {
    return this.clientDAO;
  }

  public getProjectDAO(): ProjectDAO {
    return this.projectDAO;
  }

  public getConstructionElementDAO(): ConstructionElementDAO {
    return this.constructionElementDAO;
  }

  public getDocumentTypeDAO(): DocumentTypeDAO {
    return this.documentTypeDAO;
  }

  public getDocumentDAO(): DocumentDAO {
    return this.documentDAO;
  }

  public getTextBlockDAO(): TextBlockDAO {
    return this.textBlockDAO;
  }

  // Method to switch database implementations
  public setImplementation(implementation: 'json' | 'supabase') {
    switch (implementation) {
      case 'json':
        this.clientDAO = new JsonClientDAO();
        this.projectDAO = new JsonProjectDAO();
        this.constructionElementDAO = new JsonConstructionElementDAO();
        this.documentTypeDAO = new JsonDocumentTypeDAO();
        this.documentDAO = new JsonDocumentDAO();
        this.textBlockDAO = new JsonTextBlockDAO();
        break;
      case 'supabase':
        this.clientDAO = new SupabaseClientDAO();
        this.projectDAO = new SupabaseProjectDAO();
        this.constructionElementDAO = new SupabaseConstructionElementDAO();
        this.documentTypeDAO = new SupabaseDocumentTypeDAO();
        this.documentDAO = new SupabaseDocumentDAO();
        this.textBlockDAO = new SupabaseTextBlockDAO();
        break;
      default:
        throw new Error(`Database implementation ${implementation} not supported`);
    }
  }
}
