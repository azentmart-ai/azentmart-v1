import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './app.controller.js';
import { TransactionService } from './app.service.js';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionService],
    }).compile();

    controller = module.get<TransactionsController>(
      TransactionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});