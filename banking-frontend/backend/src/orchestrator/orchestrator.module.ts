import { Module } from '@nestjs/common';

import { OrchestratorController } from './orchestrator.controller.js';
import { OrchestratorService } from './orchestrator.service.js';

import { TransactionsModule } from '../transactions/transactions.module.js';
import { AccountsModule } from '../accounts/accounts.module.js';
import { MfaModule } from '../mfa/mfa.module.js';
import { BeneficiariesModule } from '../beneficiaries/beneficiaries.module.js';
import { RiskModule } from '../risk/risk.module.js';
import { PolicyModule } from '../policy/policy.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { AuditModule } from '../audit/audit.module.js';
import { LoansModule } from '../loans/loans.module.js';
import { AgentStateModule } from '../agent-state/agent-state.module.js';
import { IntegrationGatewayModule } from '../integration-gateway/integration-gateway.module.js';
@Module({
  imports: [
    TransactionsModule,
    AccountsModule,
    MfaModule,
    BeneficiariesModule,
    RiskModule,
    PolicyModule,
    AuthModule,
    AuditModule,
    LoansModule,
    AgentStateModule,
    IntegrationGatewayModule,
    
  ],
  controllers: [OrchestratorController],
  providers: [OrchestratorService],
  exports: [OrchestratorService],
})
export class OrchestratorModule {}