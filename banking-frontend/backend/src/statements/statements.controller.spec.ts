import { Test, TestingModule } from '@nestjs/testing';
import { StatementsController } from './statements.controller.js';

describe('StatementsController', () => {
  let controller: StatementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatementsController],
    }).compile();

    controller = module.get<StatementsController>(StatementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
