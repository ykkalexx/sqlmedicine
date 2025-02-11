import { QueryAnalyzer } from "../../../core/analyzer";

describe("QueryAnalyzer", () => {
  let analyzer: QueryAnalyzer;

  beforeEach(() => {
    analyzer = new QueryAnalyzer();
  });

  test("should analyze a query and return analysis result", () => {
    const query = "SELECT * FROM users WHERE id = 1";
    const result = analyzer.analyzeQuery(query);
    expect(result).toHaveProperty("executionTime");
    expect(result).toHaveProperty("resourceUsage");
  });

  test("should return execution plan for a given query", () => {
    const query = "SELECT * FROM users WHERE id = 1";
    const executionPlan = analyzer.getExecutionPlan(query);
    expect(executionPlan).toBeDefined();
    expect(executionPlan).toHaveProperty("steps");
  });
});
