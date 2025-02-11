import { Client } from "pg";
import { Database } from "../interfaces/database";

export class PostgreSQLAdapter implements Database {
  private client: Client;

  constructor(
    private config: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    }
  ) {
    this.client = new Client(config);
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.end();
  }

  async executeQuery(query: string, params?: any[]): Promise<any> {
    const result = await this.client.query(query, params);
    return result.rows;
  }
}
