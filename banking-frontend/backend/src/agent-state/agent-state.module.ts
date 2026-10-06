import { Module } from '@nestjs/common';
import { AgentStateService } from './agent-state.service.js';

@Module({
  providers: [AgentStateService],
  exports: [AgentStateService],
})
export class AgentStateModule {}
