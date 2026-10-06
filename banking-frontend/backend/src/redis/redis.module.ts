import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service.js';
import { RedisRateLimiterService } from './redis-rate-limiter.service.js';

@Global()
@Module({
  providers: [
    RedisService,
    RedisRateLimiterService,
  ],
  exports: [
    RedisService,
    RedisRateLimiterService,
  ],
})
export class RedisModule {}