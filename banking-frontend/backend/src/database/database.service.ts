import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      user: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME ?? 'banking_ai',
    });
     
  }

  getPool(): Pool {
    return this.pool;
  }
   async testConnection(): Promise<void> {
    const result = await this.pool.query('SELECT NOW()');
    console.log('Database connection successful. Current time:', result.rows[0]);
   }

  async query(
    text: string,
    params?: any[],
  ): Promise<QueryResult> {
    return this.pool.query(text, params);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}