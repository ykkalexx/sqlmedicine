import dotenv from "dotenv";

dotenv.config();

export default {
  database: {
    postgres: {
      host: process.env.POSTGRES_DB_HOST,
      port: parseInt(process.env.POSTGRES_DB_PORT || "5432"),
      username: process.env.POSTGRES_DB_USER,
      password: process.env.POSTGRES_DB_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
    },
    mysql: {
      host: process.env.MY_SQL_DB_HOST,
      port: 3306,
      username: process.env.MY_SQL_DB_USER,
      password: process.env.MY_SQL_DB_PASSWORD,
      database: process.env.MY_SQL_DB_NAME,
    },
    dialect: "postgres", // Change to 'mysql' or anythine else as needed  as needed and add the corresponding config
  },
  logging: {
    level: "info", // Options: 'info', 'warn', 'error', 'debug'
  },
  performance: {
    metricsCollectionInterval: 5000,
  },
  optimization: {
    enableIndexSuggestions: true,
    maxSuggestions: 5,
  },
};
