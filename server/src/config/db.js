import pg from 'pg';
import dotenv from 'dotenv';
import { createTablesQuery } from './schema.js';

dotenv.config();

const { Pool, Client } = pg;

const isProduction = process.env.NODE_ENV === 'production';
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

// Build Pool configuration
const poolConfig = hasDatabaseUrl
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl:
        isProduction || process.env.DATABASE_URL.includes('sslmode=require') || process.env.DATABASE_URL.includes('neon.tech')
          ? { rejectUnauthorized: false }
          : false
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'nehircanta',
      ssl: isProduction ? { rejectUnauthorized: false } : false
    };

let pool = null;

// Ensure database exists before pooling (local standalone postgres only)
async function ensureDatabaseExists() {
  if (hasDatabaseUrl) return; // Managed cloud databases already have the database instance created

  const masterClient = new Client({
    host: poolConfig.host,
    port: poolConfig.port,
    user: poolConfig.user,
    password: poolConfig.password,
    database: 'postgres'
  });

  try {
    await masterClient.connect();
    const checkDb = await masterClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [poolConfig.database]
    );

    if (checkDb.rowCount === 0) {
      console.log(`[PostgreSQL] "${poolConfig.database}" veritabanı oluşturuluyor...`);
      await masterClient.query(`CREATE DATABASE "${poolConfig.database}"`);
      console.log(`[PostgreSQL] "${poolConfig.database}" veritabanı başarıyla oluşturuldu.`);
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

    pool = new Pool(poolConfig);

    const client = await pool.connect();
    const target = hasDatabaseUrl ? 'Cloud PostgreSQL instance' : `${poolConfig.host}:${poolConfig.port}/${poolConfig.database}`;
    console.log(`[PostgreSQL] Bağlantı başarılı: ${target}`);

    // Create tables if they do not exist
    await client.query(createTablesQuery);
    console.log('[PostgreSQL] Tablolar doğrulandı / oluşturuldu.');

    client.release();
    return pool;
  } catch (error) {
    console.error(`[PostgreSQL] Bağlantı hatası: ${error.message}`);
    if (isProduction) {
      process.exit(1);
    }
  }
};

export const query = async (text, params) => {
  if (!pool) {
    pool = new Pool(poolConfig);
  }
  return pool.query(text, params);
};

export const getPool = () => pool;
