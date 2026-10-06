import { Body, Controller, Post } from '@nestjs/common';

import { PolicyService } from './policy.service.js';
import type { PolicyContext } from './policy.service.js';

@Controller('policy')
export class PolicyController {
  constructor(
    private readonly policyService: PolicyService,
  ) {}

  @Post('evaluate')
  evaluateTransfer(
    @Body() body: PolicyContext,
  ) {
    return this.policyService.evaluateTransfer(body);
  }
}