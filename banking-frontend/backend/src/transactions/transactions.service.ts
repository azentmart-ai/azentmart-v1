
import { Injectable } from '@nestjs/common';
import { MfaService } from '../mfa/mfa.service.js';
import { DatabaseService } from '../database/database.service.js';
export interface Transaction {
  id: string;
  customerId: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  status: string;
  transferId: string | null;
  declineCode?: string;
  declineReason?: string;
}

@Injectable()
export class TransactionsService {
 
  private transactions: Transaction[] = [
    {
      id: 'T001',
      customerId: 'C123',
      type: 'CREDIT',
      amount: 25000,
      description: 'Salary',
      date: '2026-09-08',
      status: 'COMPLETED',
      transferId: null,
    },
    {
      id: 'T002',
      customerId: 'C123',
      type: 'DEBIT',
      amount: 1500,
      description: 'Online Shopping',
      date: '2026-09-07',
      status: 'COMPLETED',
      transferId: null,
    },
    {
      id: 'T003',
      customerId: 'C123',
      type: 'DEBIT',
      amount: 500,
      description: 'Restaurant',
      date: '2026-09-06',
      status: 'COMPLETED',
      transferId: null,
    },
  {
  id: 'T004',
  customerId: 'C123',
  type: 'DEBIT',
  amount: 10000,
  description: 'Online Transfer',
  date: '2026-09-09',
  status: 'DECLINED',
  transferId: null,
  declineCode: 'INSUFFICIENT_FUNDS',
  declineReason: 'Insufficient account balance',
},
  ];
  private idempotencyRecords = new Map<
    string,
    {
      transferId: string;
      transactionId: string;
      result: any;
    }
  >();

  constructor(
    private readonly mfaService: MfaService,
    private readonly databaseService: DatabaseService,
  ) {}

async getTransactions(customerId: string) {
  const result = await this.databaseService.query(
    `
    SELECT
      id,
      customer_id,
      type,
      amount,
      reference,
      created_at,
      status
    FROM transactions
    WHERE customer_id = $1
    ORDER BY created_at DESC
    `,
    [customerId],
  );

  return result.rows.map(transaction => ({
    id: transaction.id,
    customerId: transaction.customer_id,
    type: transaction.type,
    amount: Number(transaction.amount),
    description: transaction.reference,
    date: transaction.created_at,
    status: transaction.status,
    transferId: null,
  }));
}
  async getTransaction(
  customerId: string,
  transactionId: string,
) {
  const result = await this.databaseService.query(
    `
    SELECT
      id,
      customer_id,
      type,
      amount,
      reference,
      created_at,
      status
    FROM transactions
    WHERE customer_id = $1
      AND id = $2
    LIMIT 1
    `,
    [customerId, transactionId],
  );

  if (result.rows.length === 0) {
    return {
      success: false,
      message: 'Transaction not found',
    };
  }

  const transaction = result.rows[0];

  return {
    success: true,
    id: transaction.id,
    customerId: transaction.customer_id,
    type: transaction.type,
    amount: Number(transaction.amount),
    description: transaction.reference,
    date: transaction.created_at,
    status: transaction.status,
    transferId: null,
  };
}

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

async executeTransfer(
  transferId: string,
  fromCustomerId: string,
  toCustomerId: string,
  amount: number,
  idempotencyKey?: string,
) {
  // 1. Idempotency check
  if (idempotencyKey) {
    const existing = this.idempotencyRecords.get(idempotencyKey);

    if (existing) {
      return {
        ...existing.result,
        idempotent: true,
        message:
          'Existing transaction returned for this idempotency key',
      };
    }
  }

  // 2. MFA check
  if (!this.mfaService.isVerified(fromCustomerId)) {
    return {
      success: false,
      message: 'MFA verification required',
      status: 'MFA_REQUIRED',
    };
  }

  // 3. Basic validation
  if (amount <= 0) {
    return {
      success: false,
      message: 'Invalid transfer amount',
      status: 'DECLINED',
    };
  }

  if (fromCustomerId === toCustomerId) {
    return {
      success: false,
      message: 'Sender and receiver cannot be the same',
      status: 'DECLINED',
    };
  }

  // 4. Get PostgreSQL connection
  const pool = this.databaseService.getPool();
  const client = await pool.connect();

  try {
    // 5. Start database transaction
    await client.query('BEGIN');

    // 6. Get sender account
    const senderResult = await client.query(
      `
      SELECT
        id,
        tenant_id,
        customer_id,
        balance,
        currency,
        status
      FROM accounts
      WHERE customer_id = $1
        AND status = 'ACTIVE'
      LIMIT 1
      FOR UPDATE
      `,
      [fromCustomerId],
    );

    if (senderResult.rows.length === 0) {
      await client.query('ROLLBACK');

      return {
        success: false,
        message: 'Sender account not found',
        status: 'DECLINED',
      };
    }

    const sender = senderResult.rows[0];

    // 7. Check sender balance
    const senderBalance = Number(sender.balance);

    if (senderBalance < amount) {
      await client.query('ROLLBACK');

      return {
        success: false,
        message: 'Insufficient account balance',
        status: 'DECLINED',
        declineCode: 'INSUFFICIENT_FUNDS',
        declineReason: 'Insufficient account balance',
      };
    }

    // 8. Get receiver account
    const receiverResult = await client.query(
      `
      SELECT
        id,
        tenant_id,
        customer_id,
        balance,
        currency,
        status
      FROM accounts
      WHERE customer_id = $1
        AND status = 'ACTIVE'
      LIMIT 1
      FOR UPDATE
      `,
      [toCustomerId],
    );

    if (receiverResult.rows.length === 0) {
      await client.query('ROLLBACK');

      return {
        success: false,
        message: 'Receiver account not found',
        status: 'DECLINED',
      };
    }

    const receiver = receiverResult.rows[0];

    // 9. Make sure both accounts belong to the same tenant
    if (sender.tenant_id !== receiver.tenant_id) {
      await client.query('ROLLBACK');

      return {
        success: false,
        message: 'Cross-tenant transfer is not allowed',
        status: 'DECLINED',
      };
    }

    // 10. Generate PostgreSQL transaction ID
    const transactionId = `T${Date.now()}`;

    // 11. Debit sender
    await client.query(
      `
      UPDATE accounts
      SET balance = balance - $1
      WHERE id = $2
      `,
      [amount, sender.id],
    );

    // 12. Credit receiver
    await client.query(
      `
      UPDATE accounts
      SET balance = balance + $1
      WHERE id = $2
      `,
      [amount, receiver.id],
    );

    // 13. Insert transaction record
    await client.query(
      `
      INSERT INTO transactions (
        id,
        tenant_id,
        customer_id,
        account_id,
        type,
        amount,
        currency,
        status,
        reference
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        'DEBIT',
        $5,
        $6,
        'COMPLETED',
        $7
      )
      `,
      [
        transactionId,
        sender.tenant_id,
        fromCustomerId,
        sender.id,
        amount,
        sender.currency,
        `Transfer to ${toCustomerId}`,
      ],
    );

    // 14. Commit everything
    await client.query('COMMIT');

    // 15. Build response
    const result = {
      success: true,
      transferId,
      transactionId,
      fromCustomerId,
      toCustomerId,
      amount,
      status: 'COMPLETED',
      message: 'Transfer executed successfully',
    };

    // 16. Store idempotency result
    if (idempotencyKey) {
      this.idempotencyRecords.set(idempotencyKey, {
        transferId,
        transactionId,
        result,
      });
    }

    return result;
  } catch (error) {
    // Roll back any partial database changes
    await client.query('ROLLBACK');

    console.error(
      'Transfer execution failed:',
      error,
    );

    throw error;
  } finally {
    // Always release PostgreSQL connection
    client.release();
  }
}

async verifyTransaction(transactionId: string) {
  const result = await this.databaseService.query(
    `
    SELECT
      id,
      customer_id,
      type,
      amount,
      reference,
      status
    FROM transactions
    WHERE id = $1
    LIMIT 1
    `,
    [transactionId],
  );

  if (result.rows.length === 0) {
    return {
      success: false,
      message: 'Transaction not found',
      status: 'NOT_FOUND',
    };
  }

  const transaction = result.rows[0];

  return {
    success: true,
    transactionId: transaction.id,
    status: transaction.status,
    amount: Number(transaction.amount),
    type: transaction.type,
    description: transaction.reference,
    message: 'Transaction verified successfully',
  };
}
async getTransactionStatus(transactionId: string) {
  console.log('STATUS TRANSACTION ID:', transactionId);

  const result = await this.databaseService.query(
    `
    SELECT
      id,
      customer_id,
      type,
      amount,
      reference,
      status
    FROM transactions
    WHERE id = $1
    `,
    [transactionId],
  );

  console.log('STATUS DB RESULT:', result.rows);

  if (result.rows.length === 0) {
    return {
      success: false,
      message: 'Transaction not found',
    };
  }

  const transaction = result.rows[0];

  return {
    success: true,
    transactionId: transaction.id,
    status: transaction.status,
    amount: Number(transaction.amount),
    type: transaction.type,
    description: transaction.reference,

    declineCode:
      transaction.status === 'DECLINED'
        ? 'INSUFFICIENT_FUNDS'
        : null,

    declineReason:
      transaction.status === 'DECLINED'
        ? 'Insufficient account balance'
        : null,

    message:
      transaction.status === 'DECLINED'
        ? this.getFriendlyDeclineMessage(
            'INSUFFICIENT_FUNDS',
          )
        : `Transaction status is ${transaction.status}`,
  };
}

getFriendlyDeclineMessage(
  declineCode: string,
): string {
  switch (declineCode) {
    case 'INSUFFICIENT_FUNDS':
      return 'Your transaction was declined because your account balance is insufficient. Please check your balance and try again.';

    case 'LIMIT_EXCEEDED':
      return 'Your transaction exceeded the allowed transfer limit.';

    case 'BENEFICIARY_BLOCKED':
      return 'The beneficiary account is restricted or blocked.';

    case 'MFA_FAILED':
      return 'Multi-factor authentication failed. Please verify your identity and try again.';

    default:
      return 'Your transaction could not be completed. Please contact customer support.';
  }
}
}
