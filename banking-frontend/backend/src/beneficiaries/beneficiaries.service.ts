import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class BeneficiariesService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async getBeneficiary(customerId: string, name: string) {
    const result = await this.databaseService.query(
      `
      SELECT
        b.id,
        b.customer_id,
        b.beneficiary_name,
        b.beneficiary_account_number,
        b.beneficiary_bank,
        b.status,
        a.customer_id AS beneficiary_customer_id
      FROM beneficiaries b
      LEFT JOIN accounts a
        ON a.account_number = b.beneficiary_account_number
       AND a.tenant_id = b.tenant_id
      WHERE b.customer_id = $1
        AND LOWER(b.beneficiary_name) = LOWER($2)
        AND b.status = 'ACTIVE'
      LIMIT 1
      `,
      [customerId, name],
    );

    if (result.rows.length === 0) {
      return undefined;
    }

    return result.rows[0];
  }
  async validateBeneficiary(
  customerId: string,
  name: string,
  accountNumber: string,
  bankName: string,
  ifscCode: string,
) {
  console.log('VALIDATE BENEFICIARY INPUT:', {
    customerId,
    name,
    accountNumber,
    bankName,
    ifscCode,
  });

  const cleanName = String(name ?? '').trim();
  const cleanAccountNumber = String(accountNumber ?? '').trim();
  const cleanBankName = String(bankName ?? '').trim();
  const cleanIfscCode = String(ifscCode ?? '').trim().toUpperCase();

  if (
    !cleanName ||
    !cleanAccountNumber ||
    !cleanBankName ||
    !cleanIfscCode
  ) {
    return {
      success: false,
      message:
        'Beneficiary name, account number, bank name, and IFSC code are required.',
    };
  }

  return {
    success: true,
    valid: true,
    customerId,
    name: cleanName,
    accountNumber: cleanAccountNumber,
    bankName: cleanBankName,
    ifscCode: cleanIfscCode,
    message:
      'Beneficiary details are valid. Please confirm to add the beneficiary.',
  };
}
async getBeneficiaries(customerId: string) {
  const result = await this.databaseService.query(
    `
    SELECT
      id,
      customer_id,
      beneficiary_name,
      beneficiary_account_number,
      beneficiary_bank,
      ifsc_code,
      status,
      created_at
    FROM beneficiaries
    WHERE customer_id = $1
      AND status = 'ACTIVE'
    ORDER BY created_at DESC
    `,
    [customerId],
  );

  return {
    success: true,
    customerId,
    beneficiaries: result.rows,
  };
}

 async addBeneficiary(
  customerId: string,
  name: string,
  accountNumber: string,
  bankName: string,
  ifscCode: string,
) {
  const id = `B${Date.now()}`;

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

  const result = await this.databaseService.query(
    `
    INSERT INTO beneficiaries (
      id,
      tenant_id,
      customer_id,
      beneficiary_name,
      beneficiary_account_number,
      beneficiary_bank,
      ifsc_code,
      status
    )
    VALUES (
      $1::varchar,
      $2::uuid,
      $3::varchar,
      $4::varchar,
      $5::varchar,
      $6::varchar,
      $7::varchar,
      'ACTIVE'
    )
    RETURNING
      id,
      customer_id,
      beneficiary_name,
      beneficiary_account_number,
      beneficiary_bank,
      ifsc_code,
      status,
      created_at
    `,
    [
      id,
      tenantId,
      customerId,
      name,
      accountNumber,
      bankName,
      ifscCode,
    ],
  );

  return {
    success: true,
    message: `Beneficiary ${name} added successfully.`,
    beneficiary: result.rows[0],
  };
}
}