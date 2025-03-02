import Database from 'better-sqlite3';
import path from 'path';

export class SQLiteConnection {
  private static instance: Database.Database | null = null;
  private static readonly DB_PATH = path.join(process.cwd(), 'data', 'construction.db');

  private constructor() {}

  public static getInstance(): Database.Database {
    if (!SQLiteConnection.instance) {
      SQLiteConnection.instance = new Database(SQLiteConnection.DB_PATH);
      SQLiteConnection.instance.pragma('journal_mode = WAL');
      SQLiteConnection.instance.pragma('foreign_keys = ON');
    }
    return SQLiteConnection.instance;
  }

  public static closeConnection(): void {
    if (SQLiteConnection.instance) {
      SQLiteConnection.instance.close();
      SQLiteConnection.instance = null;
    }
  }
}