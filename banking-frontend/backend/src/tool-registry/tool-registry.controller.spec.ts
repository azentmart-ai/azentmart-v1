import { Test, TestingModule } from '@nestjs/testing';
import { ToolRegistryController } from './tool-registry.controller.js';

describe('ToolRegistryController', () => {
  let controller: ToolRegistryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToolRegistryController],
    }).compile();

    controller = module.get<ToolRegistryController>(ToolRegistryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
