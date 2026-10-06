import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service.js';

@Injectable()
export class RedisRateLimiterService {
  private readonly limit = 5;
  private readonly windowSeconds = 60;

  constructor(private readonly redisService: RedisService) {}

  async checkLimit(customerId: string): Promise<boolean> {
    const redis = this.redisService.getClient();

    const key = `rate-limit:customer:${customerId}`;

    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, this.windowSeconds);
    }

    return count <= this.limit;
  }
}