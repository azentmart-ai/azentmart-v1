import { Module } from '@nestjs/common';
import { AiAgentController } from './ai-agent.controller.js';
import { AiAgentService } from './ai-agent.service.js';
import { ToolsModule } from '../tools/tools.module.js';
import { OrchestratorModule } from '../orchestrator/orchestrator.module.js';
import { SecurityModule } from '../security/security.module.js';

@Module({
  imports: [ToolsModule, OrchestratorModule,SecurityModule],
  controllers: [AiAgentController],
  providers: [AiAgentService],
  exports: [AiAgentService],
})
export class AiAgentModule {}
