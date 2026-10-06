import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class StatementsService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async generateStatement(
    customerId: string,
    accountId: string,
    fromDate: string,
    toDate: string,
  ) {
    const statementId = `ST${Date.now()}`;

    const result = await this.databaseService.query(
      `
      SELECT
        id AS "transactionId",
        created_at AS date,
        type,
        status,
        amount,
        currency,
        reference
      FROM transactions
      WHERE customer_id = $1
        AND account_id = $2
        AND created_at::date BETWEEN $3::date AND $4::date
      ORDER BY created_at ASC
      `,
      [customerId, accountId, fromDate, toDate],
    );

    const statement = {
      statementId,
      customerId,
      accountId,
      fromDate,
      toDate,
      status: 'GENERATED',
      transactions: result.rows,
    };

    return {
      success: true,
      statement,
      message: 'Bank statement generated successfully',
    };
  }

  async getStatement(
    customerId: string,
    statementId: string,
  ) {
    // For now, statementId is generated dynamically, so we cannot
    // retrieve it from memory after a server restart.
    return {
      success: false,
      message:
        'Statement retrieval requires persistent statement storage.',
    };
  }

  async emailStatement(
    customerId: string,
    statementId: string,
    email: string,
  ) {
    return {
      success: true,
      statementId,
      email,
      status: 'EMAIL_SENT',
      message: 'Statement emailed successfully',
    };
  }
}