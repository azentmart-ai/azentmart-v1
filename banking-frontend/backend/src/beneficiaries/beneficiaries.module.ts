import { Module } from '@nestjs/common';
import { BeneficiariesController } from './beneficiaries.controller.js';
import { BeneficiariesService } from './beneficiaries.service.js';

@Module({
  controllers: [BeneficiariesController],
  providers: [BeneficiariesService],
  exports: [BeneficiariesService],
})
export class BeneficiariesModule {}