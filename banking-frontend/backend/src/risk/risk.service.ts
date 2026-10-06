import { Injectable } from '@nestjs/common';

@Injectable()
export class RiskService {
  assessTransfer(
    customerId: string,
    amount: number,
  ) {
    let riskLevel = 'LOW';

    if (amount >= 50000) {
      riskLevel = 'HIGH';
    } else if (amount >= 10000) {
      riskLevel = 'MEDIUM';
    }

    return {
      success: true,
      customerId,
      amount,
      riskLevel,
    };
  }
}