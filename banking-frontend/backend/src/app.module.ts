import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module.js';
import { AccountsModule } from './accounts/accounts.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { MfaModule } from './mfa/mfa.module.js';
import { ToolsModule } from './tools/tools.module.js';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module.js';
import { RiskModule } from './risk/risk.module.js';
import { PolicyModule } from './policy/policy.module.js';
import { OrchestratorModule } from './orchestrator/orchestrator.module.js';
import { AuditModule } from './audit/audit.module.js';
import { AiAgentModule } from './ai-agent/ai-agent.module.js';
import { LoansModule } from './loans/loans.module.js';
import { StatementsModule } from './statements/statements.module.js';
import { FraudModule } from './fraud/fraud.module.js';
import { AgentStateModule } from './agent-state/agent-state.module.js';
import { IntegrationGatewayModule } from './integration-gateway/integration-gateway.module.js';
import { RedisModule } from './redis/redis.module.js';
import {DatabaseModule} from './database/database.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    AccountsModule,
    TransactionsModule,
    MfaModule,
    ToolsModule,
    BeneficiariesModule,
    RiskModule,
    PolicyModule,
    OrchestratorModule,
    AuditModule,
    AiAgentModule,
    LoansModule,
    StatementsModule,
    FraudModule,
    AgentStateModule,
    IntegrationGatewayModule,
    RedisModule,
    DatabaseModule,
  ],
})
export class AppModule {}