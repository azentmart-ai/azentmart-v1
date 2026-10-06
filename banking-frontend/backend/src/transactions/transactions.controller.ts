import {
  Body,
  Controller,
  Post,
  Get,
  Param,
} from '@nestjs/common';

import { TransactionsService } from './transactions.service.js';
import { MfaService } from '../mfa/mfa.service.js';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly mfaService: MfaService,
  ) {}
@Get('verify/:transferId')
verifyTransaction(
  @Param('transferId') transferId: string,
) {
  return this.transactionsService.verifyTransaction(transferId);
}

@Get('status/:transactionId')
getTransactionStatus(
  @Param('transactionId') transactionId: string,
) {
  return this.transactionsService.getTransactionStatus(
    transactionId,
  );
}

@Get(':customerId/:transactionId')
getTransaction(
  @Param('customerId') customerId: string,
  @Param('transactionId') transactionId: string,
) {
  return this.transactionsService.getTransaction(
    customerId,
    transactionId,
  );
}

@Get(':customerId')
getTransactions(
  @Param('customerId') customerId: string,
) {
  return this.transactionsService.getTransactions(customerId);
}
}