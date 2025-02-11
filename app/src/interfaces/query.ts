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