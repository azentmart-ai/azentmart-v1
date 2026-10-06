import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TransactionService } from './app.service.js';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionService,
  ) {}

  @Post('transfer/validate')
  validateTransfer(
    @Body()
    body: {
      fromCustomerId: string;
      toCustomerId: string;
      amount: number;
    },
  ) {
    return this.transactionsService.validateTransfer(
      body.fromCustomerId,
      body.toCustomerId,
      body.amount,
    );
  }

  @Post('transfer/confirm')
  confirmTransfer(
    @Body()
    body: {
      transferId: string;
      confirmed: boolean;
    },
  ) {
    return this.transactionsService.confirmTransfer(
      body.transferId,
      body.confirmed,
    );
  }

  @Post('transfer/execute')
  executeTransfer(
    @Body()
    body: {
      transferId: string;
      fromCustomerId: string;
      toCustomerId: string;
      amount: number;
    },
  ) {
    return this.transactionsService.executeTransfer(
      body.transferId,
      body.fromCustomerId,
      body.toCustomerId,
      body.amount,
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
  getTransactions(@Param('customerId') customerId: string) {
    return this.transactionsService.getTransactions(customerId);
  }
}