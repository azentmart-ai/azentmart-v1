import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class LoansService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async getLoans(customerId: string) {
    const result = await this.databaseService.query(
      `
      SELECT
        id AS "loanId",
        customer_id AS "customerId",
        loan_type AS "type",
        status,
        principal_amount AS "principal",
        outstanding_balance AS "outstanding",
        interest_rate AS "interestRate",
        created_at AS "createdAt"
      FROM loans
      WHERE customer_id = $1
      ORDER BY created_at DESC
      `,
      [customerId],
    );

    return {
      success: true,
      loans: result.rows,
    };
  }

  async getLoanBalance(
    customerId: string,
    loanId: string,
  ) {
    const result = await this.databaseService.query(
      `
      SELECT
        id,
        customer_id,
        outstanding_balance
      FROM loans
      WHERE id = $1
        AND customer_id = $2
      LIMIT 1
      `,
      [loanId, customerId],
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'Loan not found',
      };
    }

    const loan = result.rows[0];

    return {
      success: true,
      loanId: loan.id,
      customerId: loan.customer_id,
      outstandingBalance: Number(loan.outstanding_balance),
    };
  }

  async getLoanSchedule(
    customerId: string,
    loanId: string,
  ) {
    const result = await this.databaseService.query(
      `
      SELECT
        id,
        customer_id
      FROM loans
      WHERE id = $1
        AND customer_id = $2
      LIMIT 1
      `,
      [loanId, customerId],
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'Loan not found',
      };
    }

    return {
      success: true,
      loanId,
      customerId,
      schedule: [
        {
          installment: 1,
          dueDate: '2026-10-01',
          amount: 5000,
          status: 'PENDING',
        },
        {
          installment: 2,
          dueDate: '2026-11-01',
          amount: 5000,
          status: 'PENDING',
        },
        {
          installment: 3,
          dueDate: '2026-12-01',
          amount: 5000,
          status: 'PENDING',
        },
      ],
    };
  }

  async makeLoanPayment(
    customerId: string,
    loanId: string,
    amount: number,
  ) {
    if (amount <= 0) {
      return {
        success: false,
        message: 'Invalid payment amount',
      };
    }

    const result = await this.databaseService.query(
      `
      SELECT
        id,
        customer_id,
        outstanding_balance
      FROM loans
      WHERE id = $1
        AND customer_id = $2
      FOR UPDATE
      `,
      [loanId, customerId],
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'Loan not found',
      };
    }

    const loan = result.rows[0];
    const outstanding = Number(loan.outstanding_balance);

    if (amount > outstanding) {
      return {
        success: false,
        message: 'Payment exceeds outstanding balance',
      };
    }

    const newBalance = outstanding - amount;

    await this.databaseService.query(
      `
      UPDATE loans
      SET
        outstanding_balance = $1,
        status = CASE
          WHEN $1 = 0 THEN 'PAID'
          ELSE status
        END
      WHERE id = $2
        AND customer_id = $3
      `,
      [newBalance, loanId, customerId],
    );

    return {
      success: true,
      loanId,
      customerId,
      amount,
      remainingBalance: newBalance,
      status: 'PAYMENT_COMPLETED',
      message: 'Loan payment completed successfully',
    };
  }

  async createLoan(
    customerId: string,
    loanType: string,
    principalAmount: number,
    interestRate: number = 10,
  ) {
    if (!customerId || !loanType || !principalAmount) {
      return {
        success: false,
        message:
          'Customer ID, loan type, and loan amount are required.',
      };
    }

    if (principalAmount <= 0) {
      return {
        success: false,
        message: 'Loan amount must be greater than 0.',
      };
    }

    if (interestRate < 0) {
      return {
        success: false,
        message: 'Interest rate cannot be negative.',
      };
    }

    const customerResult = await this.databaseService.query(
      `
      SELECT tenant_id
      FROM customers
      WHERE id = $1::varchar
      LIMIT 1
      `,
      [customerId],
    );

    if (customerResult.rows.length === 0) {
      return {
        success: false,
        message: 'Customer not found.',
      };
    }

    const tenantId = customerResult.rows[0].tenant_id;

    const loanId = `LN${Date.now()}`;

    const result = await this.databaseService.query(
      `
      INSERT INTO loans (
        id,
        tenant_id,
        customer_id,
        loan_type,
        principal_amount,
        outstanding_balance,
        interest_rate,
        status
      )
      VALUES (
        $1::varchar,
        $2::uuid,
        $3::varchar,
        $4::varchar,
        $5::numeric,
        $5::numeric,
        $6::numeric,
        'ACTIVE'
      )
      RETURNING
        id,
        customer_id,
        loan_type,
        principal_amount,
        outstanding_balance,
        interest_rate,
        status,
        created_at
      `,
      [
        loanId,
        tenantId,
        customerId,
        loanType,
        principalAmount,
        interestRate,
      ],
    );

    return {
      success: true,
      message: `${loanType} loan created successfully.`,
      loan: result.rows[0],
    };
  }
}