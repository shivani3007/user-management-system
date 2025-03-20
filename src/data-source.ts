import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'user_db',
  entities: ['src/**/*.entity.ts'], // Auto-load all entities
  migrations: ['src/migrations/*.ts'], // Migrations location
  synchronize: false, // Don't use in production
  logging: true,
});
