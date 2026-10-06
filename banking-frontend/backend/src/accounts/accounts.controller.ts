import { Controller, Get, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service.js';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
  ) {}

  @Get(':customerId/balance')
  getBalance(@Param('customerId') customerId: string) {
    return this.accountsService.getBalance(customerId);
  }
}