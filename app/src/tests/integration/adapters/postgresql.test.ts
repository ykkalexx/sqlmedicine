import { PostgreSQLAdapter } from "../../../adapters/postgresql";
import { Database } from "../../../interfaces/database";

describe("PostgreSQLAdapter Integration Tests", () => {
  let dbAdapter: Database;

  beforeAll(() => {
    dbAdapter = new PostgreSQLAdapter({
      host: "localhost",
      port: 5432,
      user: "testuser",
      password: "testpassword",
      database: "testdb",
    });
  });

  afterAll(async () => {
    await dbAdapter.disconnect();
  });

  test("should connect to the PostgreSQL database", async () => {
    const isConnected = await dbAdapter.connect();
    expect(isConnected).toBe(true);
  });

  test("should execute a query and return results", async () => {
    const result = await dbAdapter.execute("SELECT 1 + 1 AS sum");
    expect(result).toEqual([{ sum: 2 }]);
  });

  test("should handle query errors gracefully", async () => {
    await expect(
      dbAdapter.execute("SELECT * FROM non_existing_table")
    ).rejects.toThrow();
  });
});
