export interface Database {
  connect(connectionString: string): Promise<void>;
  disconnect(): Promise<void>;
  executeQuery(query: string, params?: any[]): Promise<any>;
}
