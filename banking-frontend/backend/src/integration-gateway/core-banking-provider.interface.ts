export interface CoreBankingProvider {
  getBalance(
    customerId: string,
  ): Promise<any>;

  getTransactions(
    customerId: string,
  ): Promise<any>;

  executeTransfer(
    transferId: string,
    fromCustomerId: string,
    toCustomerId: string,
    amount: number,
    idempotencyKey?: string,
  ): Promise<any>;

  getLoans(
    customerId: string,
  ): Promise<any>;

  getLoanBalance(
    customerId: string,
    loanId: string,
  ): Promise<any>;
}