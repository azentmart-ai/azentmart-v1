import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class AccountsService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async getBalance(customerId: string) {
    const result = await this.databaseService.query(
      `
      SELECT
        customer_id,
        balance
      FROM accounts
      WHERE customer_id = $1
        AND status = 'ACTIVE'
      LIMIT 1
      `,
      [customerId],
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'Account not found',
      };
    }

    const account = result.rows[0];

    return {
      success: true,
      customerId: account.customer_id,
      availableBalance: Number(account.balance),
    };
  }
}