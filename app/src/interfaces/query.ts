export interface Query {
  id: string;
  sql: string;
  parameters?: any[];
  executionTime?: number;
  resourceUsage?: {
    cpu: number;
    memory: number;
  };
}

export interface QueryAnalysis {
  executionTime: number;
  tableAccess: string[];
  indexUsage: {
    used: string[];
    suggested: string[];
  };
  rowsAffected: number;
  queryComplexity: "LOW" | "MEDIUM" | "HIGH";
}
