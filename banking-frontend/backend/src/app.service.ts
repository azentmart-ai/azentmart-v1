import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionService {
  
  private transactions = [
    {
      id: 'T001',
      customerId: '123456',
      type: 'CREDIT',
      amount: 25000,
      description: 'Salary',
      date: '2026-09-08',
      status: 'COMPLETED',
    },
    {
      id: 'T002',
      customerId: '123456',
      type: 'DEBIT',
      amount: 1500,
      description: 'Online Shopping',
      date: '2026-09-07',
      status: 'COMPLETED',
    },
    {
      id: 'T003',
      customerId: '123456',
      type: 'DEBIT',
      amount: 500,
      description: 'Restaurant',
      date: '2026-09-06',
      status: 'COMPLETED',
    },
  ];

  // Get all transactions for a customer
  getTransactions(customerId: string) {
    return this.transactions.filter(
      transaction => transaction.customerId === customerId,
    );
  }

  // Get one transaction
  getTransaction(customerId: string, transactionId: string) {
    return this.transactions.find(
      transaction =>
        transaction.customerId === customerId &&
        transaction.id === transactionId,
    );
  }

  // Validate transfer
  validateTransfer(
    fromCustomerId: string,
    toCustomerId: string,
    amount: number,
  ) {
    const senderBalance = 50000;

    if (amount <= 0) {
      return {
        success: false,
        message: 'Invalid transfer amount',
      };
    }

    if (fromCustomerId === toCustomerId) {
      return {
        success: false,
        message: 'Sender and receiver cannot be the same',
      };
    }

    if (amount > senderBalance) {
      return {
        success: false,
        message: 'Insufficient balance',
      };
    }

    return {
      success: true,
      message: 'Transfer validated',
      fromCustomerId,
      toCustomerId,
      amount,
    };
  }

  // Confirm transfer
  confirmTransfer(transferId: string, confirmed: boolean) {
    if (!confirmed) {
      return {
        success: false,
        message: 'Transfer cancelled by customer',
        status: 'CANCELLED',
      };
    }

    return {
      success: true,
      transferId,
      message: 'Transfer confirmed. MFA verification required.',
      status: 'PENDING_MFA',
      requiresMFA: true,
    };
  }
  executeTransfer(
  transferId: string,
  fromCustomerId: string,
  toCustomerId: string,
  amount: number,
) {
  // MFA check
  if (!this.verifiedCustomers.has(fromCustomerId)) {
    return {
      success: false,
      message: 'MFA verification required',
      status: 'MFA_REQUIRED',
    };
  }

  const senderBalance = 50000;

  if (amount <= 0) {
    return {
      success: false,
      message: 'Invalid transfer amount',
    };
  }

  if (amount > senderBalance) {
    return {
      success: false,
      message: 'Insufficient balance',
    };
  }

  const debitTransaction = {
    id: `T${this.transactions.length + 1}`,
    customerId: fromCustomerId,
    type: 'DEBIT',
    amount,
    description: `Transfer to ${toCustomerId}`,
    date: new Date().toISOString().split('T')[0],
    status: 'COMPLETED',
  };

  const creditTransaction = {
    id: `T${this.transactions.length + 2}`,
    customerId: toCustomerId,
    type: 'CREDIT',
    amount,
    description: `Transfer from ${fromCustomerId}`,
    date: new Date().toISOString().split('T')[0],
    status: 'COMPLETED',
  };

  this.transactions.push(debitTransaction, creditTransaction);

  return {
    success: true,
    transferId,
    message: 'Transfer completed successfully',
    status: 'COMPLETED',
    amount,
    fromCustomerId,
    toCustomerId,
  };
}
private verifiedCustomers = new Set<string>();

setMfaVerified(customerId: string) {
  this.verifiedCustomers.add(customerId);
}

isMfaVerified(customerId: string) {
  return this.verifiedCustomers.has(customerId);
}
}