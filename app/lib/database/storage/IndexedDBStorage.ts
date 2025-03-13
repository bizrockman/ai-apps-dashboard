import { openDB, IDBPDatabase } from 'idb';

export class IndexedDBStorage {
  private static instance: IndexedDBStorage;
  private db: Promise<IDBPDatabase> | null = null;
  private initError: Error | null = null;

  private constructor() {
    this.initDB().catch(err => {
      console.error('Failed to initialize IndexedDB:', err);
      this.initError = err;
    });
  }

  public static getInstance(): IndexedDBStorage {
    if (!IndexedDBStorage.instance) {
      IndexedDBStorage.instance = new IndexedDBStorage();
    }
    return IndexedDBStorage.instance;
  }

  private async initDB(): Promise<IDBPDatabase> {
    if (this.db) return this.db;

    this.db = openDB('construction-db', 3, {
      upgrade(db) {
        // Create or update stores
        if (!db.objectStoreNames.contains('clients')) {
          const clientStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
          clientStore.createIndex('email', 'email', { unique: true });
        }
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
          projectStore.createIndex('code', 'code', { unique: true });
        }
        if (!db.objectStoreNames.contains('constructionElements')) {
          const elementStore = db.createObjectStore('constructionElements', { keyPath: 'id', autoIncrement: true });
          elementStore.createIndex('code', 'code', { unique: true });
        }
        if (!db.objectStoreNames.contains('documentTypes')) {
          db.createObjectStore('documentTypes', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('textBlocks')) {
          const textBlockStore = db.createObjectStore('textBlocks', { keyPath: 'id', autoIncrement: true });
          textBlockStore.createIndex('shortcut', 'shortcut', { unique: true });
        }
        if (!db.objectStoreNames.contains('documentTypeBlocks')) {
          db.createObjectStore('documentTypeBlocks', { keyPath: 'id', autoIncrement: true });
        }
      }
    });

    return this.db;
  }

  async getAll(storeName: string): Promise<any[]> {
    if (this.initError) {
      throw new Error(`Database initialization failed: ${this.initError.message}`);
    }

    const db = await this.db;
    return db.getAll(storeName);
  }

  async get(storeName: string, id: number): Promise<any> {
    if (this.initError) {
      throw new Error(`Database initialization failed: ${this.initError.message}`);
    }

    const db = await this.db;
    return db.get(storeName, id);
  }

  async add(storeName: string, data: any): Promise<number> {
    if (this.initError) {
      throw new Error(`Database initialization failed: ${this.initError.message}`);
    }

    const db = await this.db;
    const record = {
      // Remove id if it exists to let autoIncrement work
      ...Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== 'id')
      ),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      return await db.add(storeName, record);
    } catch (error) {
      if (error.name === 'ConstraintError' && storeName === 'textBlocks') {
        throw new Error(`A record with the same unique key already exists in ${storeName}`);
      }
      throw error;
    }
  }

  async put(storeName: string, data: any): Promise<number> {
    if (this.initError) {
      throw new Error(`Database initialization failed: ${this.initError.message}`);
    }

    const db = await this.db;
    return db.put(storeName, {
      ...data,
      updatedAt: new Date()
    });
  }

  async delete(storeName: string, id: number): Promise<void> {
    if (this.initError) {
      throw new Error(`Database initialization failed: ${this.initError.message}`);
    }

    const db = await this.db;
    return db.delete(storeName, id);
  }

  async clear(storeName: string): Promise<void> {
    if (this.initError) {
      throw new Error(`Database initialization failed: ${this.initError.message}`);
    }

    const db = await this.db;
    return db.clear(storeName);
  }
}