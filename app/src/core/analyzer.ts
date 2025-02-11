import { Database } from "../interfaces/database";
import { QueryAnalysis } from "../interfaces/query";

export class QueryAnalyzer {
  constructor(private database: Database) {}

  async analyzeQuery(query: string): Promise<QueryAnalysis> {
    const startTime = Date.now();
    const executionPlan = await this.getExecutionPlan(query);
    const executionTime = Date.now() - startTime;

    const analysis: QueryAnalysis = {
      executionTime,
      tableAccess: this.extractTableAccess(executionPlan),
      indexUsage: this.analyzeIndexUsage(executionPlan),
      rowsAffected: this.extractRowsAffected(executionPlan),
      queryComplexity: this.determineComplexity(query, executionPlan),
    };

    return analysis;
  }

  async getExecutionPlan(query: string): Promise<any> {
    const plan = await this.database.executeQuery(`EXPLAIN (FORMAT JSON) ${query}`);
    return plan;
  }

  /*
  extractTableAccess function is used to extract the table names from the execution plan.
  i do this because i want to know which tables are being accessed by the query. 
  it returns an array of table names.
  */
  private extractTableAccess(plan: any): string[] {
    const tables = new Set<string>();

    const extractTables = (node: any) => {
      if (node["Table Name"]) {
        tables.add(node["Table Name"]);
      }
      if (node["Plans"]) {
        node["Plans"].forEach((subPlan: any) => extractTables(subPlan));
      }
    };

    extractTables(plan);
    return Array.from(tables);
  }

  // analyzeIndexUsage is used for analyzing the index usage in the execution plan.
  // i do this because i want to know which indexes are being used by the query.
  // it returns an object with two arrays: used and suggested indexes.
  private analyzeIndexUsage(plan: any): { used: string[]; suggested: string[] } {
    const used: string[] = [];
    const suggested: string[] = [];

    const analyzeNode = (node: any) => {
      if (node["Index Name"]) {
        used.push(node["Index Name"]);
      }
      if (node["Plans"]) {
        node["Plans"].forEach((subPlan: any) => analyzeNode(subPlan));
      }
    };

    analyzeNode(plan);

    // Suggest indexes for sequential scans on large tables
    if (plan["Node Type"] === "Seq Scan" && plan["Actual Rows"] > 1000) {
      suggested.push(`idx_${plan["Table Name"]}_${plan["Filter"]}`);
    }

    return { used, suggested };
  }

  // extractRowsAffected is used to extract the number of rows affected by the query.
  private extractRowsAffected(plan: any): number {
    return plan["Actual Rows"] || 0;
  }

  // determineComplexity is used to determine the complexity of the query based on the execution plan.
  // i do this because i want to know how complex the query is.
  // it returns a string indicating the complexity: "LOW", "MEDIUM", or "HIGH".
  private determineComplexity(query: string, plan: any): "LOW" | "MEDIUM" | "HIGH" {
    const cost = plan["Total Cost"] || 0;
    const joinCount = (query.match(/join/gi) || []).length;

    if (cost < 100 && joinCount <= 1) return "LOW";
    if (cost < 1000 && joinCount <= 3) return "MEDIUM";
    return "HIGH";
  }
}
