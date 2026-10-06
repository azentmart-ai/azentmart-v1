import { Injectable } from '@nestjs/common';

export interface PolicyContext {
  customerId: string;

  // Transaction
  amount: number;
  transactionType: string;

  // Customer / account
  customerStatus: string;
  accountStatus: string;

  // Beneficiary
  beneficiaryStatus: string;

  // Security
  deviceTrusted: boolean;
  authenticationLevel: string;

  // Risk / location
  riskLevel: string;
  geography: string;

  // Regulatory
  regulatoryRules: {
    amlClear: boolean;
    sanctionsClear: boolean;
    kycVerified: boolean;
  };
}

export interface PolicyResult {
  success: boolean;
  decision: 'ALLOW' | 'REQUIRE_MFA' | 'REQUIRE_CONFIRMATION' | 'BLOCK';
  risk: string;
  reason: string;

  checks: {
    transactionLimit: boolean;
    customerStatus: boolean;
    accountStatus: boolean;
    beneficiaryStatus: boolean;
    deviceTrust: boolean;
    transactionRisk: boolean;
    geography: boolean;
    authenticationLevel: boolean;
    regulatoryRules: boolean;
  };
}

@Injectable()
export class PolicyService {
  private readonly transactionLimit = 50000;

  evaluateTransfer(
    context: PolicyContext,
  ): PolicyResult {
    const {
      amount,
      customerStatus,
      accountStatus,
      beneficiaryStatus,
      deviceTrusted,
      authenticationLevel,
      riskLevel,
      geography,
      regulatoryRules,
    } = context;

    const checks = {
      transactionLimit: amount <= this.transactionLimit,

      customerStatus:
        customerStatus === 'ACTIVE',

      accountStatus:
        accountStatus === 'ACTIVE',

      beneficiaryStatus:
        beneficiaryStatus === 'ACTIVE',

      deviceTrust:
        deviceTrusted,

      transactionRisk:
        riskLevel === 'LOW' ||
        riskLevel === 'MEDIUM' ||
        riskLevel === 'HIGH',

      geography:
        geography === 'IN',

      authenticationLevel:
        authenticationLevel === 'STRONG' ||
        authenticationLevel === 'MFA',

      regulatoryRules:
        regulatoryRules.amlClear &&
        regulatoryRules.sanctionsClear &&
        regulatoryRules.kycVerified,
    };

    // ---------------------------------
    // 1. HARD BLOCK RULES
    // ---------------------------------

    if (!checks.customerStatus) {
      return this.result(
        'BLOCK',
        'HIGH',
        'Customer account is not active',
        checks,
      );
    }

    if (!checks.accountStatus) {
      return this.result(
        'BLOCK',
        'HIGH',
        'Account is not active',
        checks,
      );
    }

    if (!checks.beneficiaryStatus) {
      return this.result(
        'BLOCK',
        'HIGH',
        'Beneficiary is not active',
        checks,
      );
    }

    if (!checks.transactionLimit) {
      return this.result(
        'BLOCK',
        'HIGH',
        'Transaction exceeds the allowed transaction limit',
        checks,
      );
    }

    if (!checks.geography) {
      return this.result(
        'BLOCK',
        'HIGH',
        'Transaction geography is restricted',
        checks,
      );
    }

    if (!regulatoryRules.amlClear) {
      return this.result(
        'BLOCK',
        'HIGH',
        'AML regulatory check failed',
        checks,
      );
    }

    if (!regulatoryRules.sanctionsClear) {
      return this.result(
        'BLOCK',
        'HIGH',
        'Sanctions screening failed',
        checks,
      );
    }

    if (!regulatoryRules.kycVerified) {
      return this.result(
        'BLOCK',
        'HIGH',
        'Customer KYC verification is required',
        checks,
      );
    }

    // ---------------------------------
    // 2. MFA RULES
    // ---------------------------------

    if (riskLevel === 'HIGH') {
      return this.result(
        'REQUIRE_MFA',
        'HIGH',
        'High-risk transaction requires MFA',
        checks,
      );
    }

    if (!deviceTrusted) {
      return this.result(
        'REQUIRE_MFA',
        'HIGH',
        'Transaction is being performed from an untrusted device',
        checks,
      );
    }

    if (
      authenticationLevel !== 'STRONG' &&
      authenticationLevel !== 'MFA'
    ) {
      return this.result(
        'REQUIRE_MFA',
        'MEDIUM',
        'Transaction requires a stronger authentication level',
        checks,
      );
    }

    // ---------------------------------
    // 3. CONFIRMATION RULE
    // ---------------------------------

    if (amount > 0) {
      return this.result(
        'REQUIRE_CONFIRMATION',
        riskLevel,
        'Customer confirmation is required before executing the transaction',
        checks,
      );
    }

    // ---------------------------------
    // 4. ALLOW
    // ---------------------------------

    return this.result(
      'ALLOW',
      riskLevel,
      'Transaction complies with banking policy',
      checks,
    );
  }

  private result(
    decision:
      | 'ALLOW'
      | 'REQUIRE_MFA'
      | 'REQUIRE_CONFIRMATION'
      | 'BLOCK',
    risk: string,
    reason: string,
    checks: PolicyResult['checks'],
  ): PolicyResult {
    return {
      success: true,
      decision,
      risk,
      reason,
      checks,
    };
  }
}