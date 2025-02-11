import { PostgreSQLAdapter } from "./adapters/postgresql";
import { MySQLAdapter } from "./adapters/mysql";
import { QueryAnalyzer } from "./core/analyzer";
import { QueryProfiler } from "./core/profiler";
import { QueryOptimizer } from "./core/optimizer";
import { Database } from "./interfaces/database";
import config from "./config/default";

async function initializeApp() {
  console.log("Initializing Query Optimization Profiler...");

  // Initialize database adapters based on dialect
  let dbAdapter: Database;

  if (config.database.dialect === "postgres") {
    dbAdapter = new PostgreSQLAdapter({
      host: config.database.postgres.host as string,
      port: config.database.postgres.port,
      user: config.database.postgres.username as string,
      password: config.database.postgres.password as string,
      database: config.database.postgres.database as string,
    });
  } else if (config.database.dialect === "mysql") {
    dbAdapter = new MySQLAdapter({
      host: config.database.mysql.host as string,
      port: config.database.mysql.port,
      user: config.database.mysql.username as string,
      password: config.database.mysql.password as string,
      database: config.database.mysql.database as string,
    });
  } else {
    throw new Error(`Unsupported database dialect: ${config.database.dialect}`);
  }

  try {
    await dbAdapter.connect();
    console.log(`Successfully connected to ${config.database.dialect} database`);

    // Initialize core components
    const queryAnalyzer = new QueryAnalyzer(dbAdapter);
    const queryProfiler = new QueryProfiler();
    const queryOptimizer = new QueryOptimizer();
  } catch (error: any) {
    console.error(`Failed to connect to database: ${error.message}`);
    process.exit(1);
  }
}

// Start the application
initializeApp().catch(console.error);
