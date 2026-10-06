import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis = new Redis(
    process.env.REDIS_URL ?? 'redis://localhost:6379',
  );

  constructor() {
  this.redis.on('connect', () => {
    console.log('Redis connected');
  });

  this.redis.on('error', (error) => {
    console.error('Redis connection error:', error);
  });

  this.testConnection()
    .then((result) => {
      console.log('Redis ping result:', result);
    })
    .catch((error) => {
      console.error('Redis ping failed:', error);
    });
}
  getClient() {
    return this.redis;
  }
async testConnection() {
  const result = await this.redis.ping();
  console.log('Redis ping:', result);
  return result;
}
  async onModuleDestroy() {
    await this.redis.quit();
  }
}