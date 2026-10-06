import { Controller, Get, Post, Body, Query } from '@nestjs/common';import { IntegrationGatewayService } from './integration-gateway.service.js';

@Controller('integration')
export class IntegrationGatewayController {
  constructor(
    private readonly integrationGateway: IntegrationGatewayService,
  ) {}

  @Get('balance')
  getBalance(@Query('customerId') customerId: string) {
    return this.integrationGateway.getBalance(customerId);
  }
  @Post('transfer')
executeTransfer(
  @Body()
  body: {
    transferId: string;
    fromCustomerId: string;
    toCustomerId: string;
    amount: number;
    idempotencyKey: string;
  },
) {
  return this.integrationGateway.executeTransfer(
    body.transferId,
    body.fromCustomerId,
    body.toCustomerId,
    body.amount,
    body.idempotencyKey,
  );
}
}