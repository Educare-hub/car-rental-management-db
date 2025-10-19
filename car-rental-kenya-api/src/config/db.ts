import dotenv from "dotenv";
import sql from "mssql";
import assert from "assert";

dotenv.config();

// Validate required env variables
const {
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_SERVER,
  DB_PORT,
  DB_ENCRYPT,
  DB_TRUST_SERVER_CERT,
  DB_POOL_MAX,
  DB_POOL_MIN,
  DB_POOL_IDLE_TIMEOUT,
} = process.env;

assert(DB_USER, "DB_USER is required");
assert(DB_PASSWORD, "DB_PASSWORD is required");
assert(DB_DATABASE, "DB_DATABASE is required");
assert(DB_SERVER, "DB_SERVER is required");

const sqlConfig: sql.config = {
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  server: DB_SERVER,
  port: Number(DB_PORT) || 1433,
  pool: {
    max: Number(DB_POOL_MAX) || 10,
    min: Number(DB_POOL_MIN) || 0,
    idleTimeoutMillis: Number(DB_POOL_IDLE_TIMEOUT) || 30000,
  },
  options: {
    encrypt: DB_ENCRYPT === "true",
    trustServerCertificate: DB_TRUST_SERVER_CERT === "true",
  },
};

export const getPool = async () => {
  try {
    const pool = await sql.connect(sqlConfig);
    console.log("✅ Connected to Microsoft SQL Server successfully");
    return pool;
  } catch (error) {
    console.error("❌ Database connection error:", (error as Error).message);
    throw error;
  }
};
