
import { Body, Controller, Post } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service.js';
@Controller('orchestrator')
export class OrchestratorController {
  constructor(
    private readonly orchestratorService: OrchestratorService,
  ) {}

  @Post('transfer')
  executeTransfer(
    @Body()
    body: {
      email: string;
      password: string;
      message: string;
    },
  ) {
    return this.orchestratorService.executeTransfer(
      body.email,
      body.password,
      body.message,
    );
  }
  
  @Post('confirm')
  confirmTransfer(
    @Body()
    body: {
      transferId: string;
      confirmed: boolean;
    },
  ) {
    return this.orchestratorService.confirmTransfer(
      body.transferId,
      body.confirmed,
    );
  }
  @Post('execute-transfer')
executeTransferDirect(@Body() body: {
  transferId: string;
  fromCustomerId: string;
  toCustomerId: string;
  amount: number;
  idempotencyKey: string;
}) {
  return this.orchestratorService.executeTransferDirect(
    body.transferId,
    body.fromCustomerId,
    body.toCustomerId,
    body.amount,
    body.idempotencyKey,
  );
}
}
