import { Module } from '@nestjs/common';
import { IntegrationGatewayService } from './integration-gateway.service.js';
import { CoreBankingAdapter } from './core-banking.adapter.js';
import { IntegrationGatewayController } from './integration-gateway.controller.js';
import { AccountsModule } from '../accounts/accounts.module.js';
import { TransactionsModule } from '../transactions/transactions.module.js';
import { LoansModule } from '../loans/loans.module.js';
import { CircuitBreakerService } from './circuit-breaker.service.js';
import { IntegrationAuthService } from './integration-auth.service.js';
import { ResponseNormalizerService } from './response-normalizer.service.js';
import { IntegrationObservabilityService } from './integration-observability.service.js';
@Module({
  imports: [
    AccountsModule,
    TransactionsModule,
    LoansModule,
  ],
  controllers: [
    IntegrationGatewayController,
  ],
  providers: [
    IntegrationGatewayService,
    CoreBankingAdapter,
    CircuitBreakerService,
    IntegrationAuthService,
    ResponseNormalizerService,
    IntegrationObservabilityService,
  ],
  exports: [
    IntegrationGatewayService,
    CoreBankingAdapter,
  ],
})
export class IntegrationGatewayModule {}