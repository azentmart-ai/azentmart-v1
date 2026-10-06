import { Module } from '@nestjs/common';
import { FraudService } from './fraud.service.js';
import { FraudReviewService } from './fraud-review.service.js';
@Module({
  providers: [
    FraudService,
    FraudReviewService,
  ],
  exports: [
    FraudService,
    FraudReviewService,
  ],
})
export class FraudModule {}