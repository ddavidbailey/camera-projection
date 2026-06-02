import { Pool } from "pg";

let _pool: Pool | undefined;

export function getPool(): Pool {
  if (!_pool) _pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true } });
  return _pool;
}
