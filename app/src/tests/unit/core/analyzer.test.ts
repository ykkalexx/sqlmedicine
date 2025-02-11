import { QueryAnalyzer } from "../../../core/analyzer";
import { Database } from "../../../interfaces/database";

describe("QueryAnalyzer", () => {
  let mockDatabase: jest.Mocked<Database>;
  let analyzer: QueryAnalyzer;

  beforeEach(() => {
    mockDatabase = {
      executeQuery: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
    } as any;

    analyzer = new QueryAnalyzer(mockDatabase);
  });

  test("should analyze a query and return analysis result", async () => {
    const mockPlan = {
      "Node Type": "Seq Scan",
      "Table Name": "users",
      "Actual Rows": 100,
      "Total Cost": 50,
    };

    mockDatabase.executeQuery.mockResolvedValue(mockPlan);

    const query = "SELECT * FROM users WHERE id = 1";
    const result = await analyzer.analyzeQuery(query);

    expect(result).toHaveProperty("executionTime");
    expect(result).toHaveProperty("tableAccess");
    expect(result).toHaveProperty("indexUsage");
    expect(result).toHaveProperty("rowsAffected");
    expect(result).toHaveProperty("queryComplexity");
  });

  test("should return execution plan for a given query", async () => {
    const mockPlan = {
      "Node Type": "Index Scan",
      "Table Name": "users",
      "Index Name": "users_pkey",
    };

    mockDatabase.executeQuery.mockResolvedValue(mockPlan);

    const query = "SELECT * FROM users WHERE id = 1";
    const executionPlan = await analyzer.getExecutionPlan(query);

    expect(executionPlan).toBeDefined();
    expect(mockDatabase.executeQuery).toHaveBeenCalledWith(expect.stringContaining("EXPLAIN (FORMAT JSON)"));
  });

  test("should suggest indexes for large sequential scans", async () => {
    const mockPlan = {
      "Node Type": "Seq Scan",
      "Table Name": "users",
      "Actual Rows": 2000,
      Filter: "email",
    };

    mockDatabase.executeQuery.mockResolvedValue(mockPlan);

    const query = "SELECT * FROM users WHERE email = 'test@example.com'";
    const result = await analyzer.analyzeQuery(query);

    expect(result.indexUsage.suggested).toContain("idx_users_email");
  });
});
