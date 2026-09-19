import pg from 'pg';
import dotenv from 'dotenv';
import { createTablesQuery } from './schema.js';

dotenv.config();

const { Pool, Client } = pg;

const dbConfig = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'nehircanta'
};

let pool = null;

// Ensure database exists before pooling
async function ensureDatabaseExists() {
  const masterClient = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: 'postgres'
  });

  try {
    await masterClient.connect();
    const checkDb = await masterClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbConfig.database]
    );

    if (checkDb.rowCount === 0) {
      console.log(`[PostgreSQL] "${dbConfig.database}" veritabanı oluşturuluyor...`);
      await masterClient.query(`CREATE DATABASE "${dbConfig.database}"`);
      console.log(`[PostgreSQL] "${dbConfig.database}" veritabanı başarıyla oluşturuldu.`);
    }
  } catch (err) {
    console.warn(`[PostgreSQL] Veritabanı varlık kontrolü uyarısı: ${err.message}`);
  } finally {
    try {
      await masterClient.end();
    } catch {}
  }
}

export const connectDB = async () => {
  try {
    await ensureDatabaseExists();

    pool = new Pool(dbConfig);

    const client = await pool.connect();
    console.log(`[PostgreSQL] Bağlantı başarılı: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

    // Create tables if they do not exist
    await client.query(createTablesQuery);
    console.log('[PostgreSQL] Tablolar doğrulandı / oluşturuldu.');

    client.release();
    return pool;
  } catch (error) {
    console.error(`[PostgreSQL] Bağlantı hatası: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export const query = async (text, params) => {
  if (!pool) {
    pool = new Pool(dbConfig);
  }
  return pool.query(text, params);
};

export const getPool = () => pool;
