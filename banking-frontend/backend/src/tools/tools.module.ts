import { Module } from '@nestjs/common';

import { ToolRegistryController } from '../tool-registry/tool-registry.controller.js';
import { ToolRegistryService } from '../tool-registry/tool-registry.service.js';
import { ToolExecutorService } from '../tool-registry/tool-executor.service.js';

import { OrchestratorModule } from '../orchestrator/orchestrator.module.js';
import { TransactionsModule } from '../transactions/transactions.module.js';
import { AccountsModule } from '../accounts/accounts.module.js';
import { BeneficiariesModule } from '../beneficiaries/beneficiaries.module.js';
import { RiskModule } from '../risk/risk.module.js';
import { PolicyModule } from '../policy/policy.module.js';
import { MfaModule } from '../mfa/mfa.module.js';
import { LoansModule } from '../loans/loans.module.js';
import { TransactionsService } from '../transactions/transactions.service.js';
import { AccountsService } from '../accounts/accounts.service.js';
import { BeneficiariesService } from '../beneficiaries/beneficiaries.service.js';
import { RiskService } from '../risk/risk.service.js';
import { PolicyService } from '../policy/policy.service.js';
import { LoansService } from '../loans/loans.service.js';
import { StatementsModule } from '../statements/statements.module.js';
import { FraudModule } from '../fraud/fraud.module.js';
import { ToolAuthorizationService } from './tool-authorization.service.js';
import { IntegrationGatewayModule } from '../integration-gateway/integration-gateway.module.js';

@Module({
  imports: [
    TransactionsModule,
    AccountsModule,
    IntegrationGatewayModule,
    BeneficiariesModule,
    RiskModule,
    PolicyModule,
    MfaModule,
    OrchestratorModule,
    LoansModule,
    StatementsModule,
    FraudModule,
  ],

  controllers: [
    ToolRegistryController,
  ],

  providers: [
    ToolRegistryService,
    ToolExecutorService,
    TransactionsService,
    AccountsService,
    BeneficiariesService,
    RiskService,
    PolicyService,
    LoansService,
    ToolAuthorizationService,
  ],

  exports: [
    ToolRegistryService,
    ToolExecutorService,
  ],
})
export class ToolsModule {}