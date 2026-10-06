import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller.js';
import { TransactionsService } from './transactions.service.js';
import { MfaModule } from '../mfa/mfa.module.js';

@Module({
  imports: [MfaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
    exports: [TransactionsService],

})
export class TransactionsModule {}
