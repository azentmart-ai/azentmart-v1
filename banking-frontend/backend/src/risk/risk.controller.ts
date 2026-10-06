import { Body, Controller, Post } from '@nestjs/common';
import { RiskService } from './risk.service.js';

@Controller('risk')
export class RiskController {
  constructor(
    private readonly riskService: RiskService,
  ) {}

  @Post('assess')
  assessTransfer(
    @Body()
    body: {
      customerId: string;
      amount: number;
    },
  ) {
    return this.riskService.assessTransfer(
      body.customerId,
      body.amount,
    );
  }
}