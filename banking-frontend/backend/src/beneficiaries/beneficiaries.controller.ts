import { Controller, Get, Param } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service.js';

@Controller('beneficiaries')
export class BeneficiariesController {
  constructor(
    private readonly beneficiariesService: BeneficiariesService,
  ) {}

  @Get(':customerId/:name')
  getBeneficiary(
    @Param('customerId') customerId: string,
    @Param('name') name: string,
  ) {
    return this.beneficiariesService.getBeneficiary(
      customerId,
      name,
    );
  }
}