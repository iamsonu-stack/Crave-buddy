
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const required = ['DB_NAME', 'DB_USER'];

for (const variable of required) {
  if (!process.env[variable]) {
    throw new Error(
      `Missing ${variable} in backend/.env. ` +
      'Copy .env.example to .env and set your PostgreSQL details.'
    );
  }
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message);
});

export default pool;
