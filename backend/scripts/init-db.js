
import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pool from '../db.js';

dotenv.config();

const currentDir = dirname(fileURLToPath(import.meta.url));

try {
  const schema = await readFile(
    resolve(currentDir, '../schema.sql'),
    'utf8'
  );

  await pool.query(schema);

  console.log('CraveBuddy database schema is ready.');
} catch (error) {
  console.error(
    'Could not initialise the database:',
    error.message
  );

  process.exitCode = 1;
} finally {
  await pool.end();
}