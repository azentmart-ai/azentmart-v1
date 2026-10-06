import { Test, TestingModule } from '@nestjs/testing';
import { AgentStateService } from './agent-state.service.js';

describe('AgentStateService', () => {
  let service: AgentStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentStateService],
    }).compile();

    service = module.get<AgentStateService>(AgentStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
