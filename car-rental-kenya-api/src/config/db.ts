import * as sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const sqlConfig: sql.config = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "",
  server: process.env.DB_SERVER || "",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000, // 30 seconds
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const poolPromise: Promise<sql.ConnectionPool> = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then((pool: sql.ConnectionPool) => {
    console.log("✅ Connected to MSSQL database");
    return pool;
  })
  .catch((err: Error) => {
    console.error("❌ Database connection failed:", err.message);
    throw err;
  });

export default sql;
