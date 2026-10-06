import { Injectable } from '@nestjs/common';

@Injectable()
export class FraudService {

  assessTransaction(
    customerId: string,
    amount: number,
    transactionVelocity: number = 1,
    deviceTrusted: boolean = true,
    geography: string = 'IN',
  ) {

    let riskScore = 0;
    const signals: string[] = [];

    // High transaction amount
    if (amount >= 50000) {
      riskScore += 30;
      signals.push('HIGH_TRANSACTION_AMOUNT');
    }

    // Multiple transactions in short period
    if (transactionVelocity >= 5) {
      riskScore += 25;
      signals.push('HIGH_TRANSACTION_VELOCITY');
    }

    // Untrusted device
    if (!deviceTrusted) {
      riskScore += 25;
      signals.push('UNTRUSTED_DEVICE');
    }

    // Foreign geography
    if (geography !== 'IN') {
      riskScore += 20;
      signals.push('UNUSUAL_GEOGRAPHY');
    }

    let riskLevel = 'LOW';

    if (riskScore >= 60) {
      riskLevel = 'HIGH';
    } else if (riskScore >= 30) {
      riskLevel = 'MEDIUM';
    }

    return {
      success: true,
      customerId,
      amount,
      riskScore,
      riskLevel,
      signals,
      fraudDecision:
        riskLevel === 'HIGH'
          ? 'REVIEW_REQUIRED'
          : 'ALLOW',
      message:
        riskLevel === 'HIGH'
          ? 'Transaction requires fraud review.'
          : 'No significant fraud indicators detected.',
    };
  }
}