export interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  executeQuery(query: string, params?: any[]): Promise<any>;
}
