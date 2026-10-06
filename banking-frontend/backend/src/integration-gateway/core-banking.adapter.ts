import { Injectable } from '@nestjs/common';
import { CoreBankingProvider } from './core-banking-provider.interface.js';
import { AccountsService } from '../accounts/accounts.service.js';
import { TransactionsService } from '../transactions/transactions.service.js';
import { LoansService } from '../loans/loans.service.js';
import { IntegrationAuthService } from './integration-auth.service.js';
@Injectable()
export class CoreBankingAdapter implements CoreBankingProvider {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly transactionsService: TransactionsService,
    private readonly loansService: LoansService,
    private readonly authService: IntegrationAuthService,
  ) {}

  async getBalance(customerId: string) {
    return this.accountsService.getBalance(customerId);
  }

  async getTransactions(customerId: string) {
    return this.transactionsService.getTransactions(customerId);
  }

  async executeTransfer(
    transferId: string,
    fromCustomerId: string,
    toCustomerId: string,
    amount: number,
    idempotencyKey?: string,
  ) {
  const headers = this.authService.getAuthHeaders();

    return this.transactionsService.executeTransfer(
      transferId,
      fromCustomerId,
      toCustomerId,
      amount,
      idempotencyKey,
    );
  }

  async getLoans(customerId: string) {
    return this.loansService.getLoans(customerId);
  }

  async getLoanBalance(
    customerId: string,
    loanId: string,
  ) {
    return this.loansService.getLoanBalance(
      customerId,
      loanId,
    );
  }
}