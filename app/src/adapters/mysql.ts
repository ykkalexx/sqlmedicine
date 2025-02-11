import mysql from "mysql2/promise";
import { Database } from "../interfaces/database";

export class MySQLAdapter implements Database {
  private connection: mysql.Connection | null = null;

  constructor(
    private config: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    }
  ) {}

  async connect(): Promise<void> {
    this.connection = await mysql.createConnection({
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      password: this.config.password,
      database: this.config.database,
    });
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
    }
  }

  async executeQuery(query: string, params?: any[]): Promise<any> {
    if (!this.connection) throw new Error("Not connected to database");
    const [results] = await this.connection.execute(query, params);
    return results;
  }
}
