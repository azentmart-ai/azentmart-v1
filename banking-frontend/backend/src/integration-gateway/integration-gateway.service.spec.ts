import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationGatewayService } from './integration-gateway.service.js';

describe('IntegrationGatewayService', () => {
  let service: IntegrationGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntegrationGatewayService],
    }).compile();

    service = module.get<IntegrationGatewayService>(IntegrationGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
