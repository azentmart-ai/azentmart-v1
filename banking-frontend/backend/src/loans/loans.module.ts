import { Module } from '@nestjs/common';
import { LoansService } from './loans.service.js';
import {DatabaseModule} from '../database/database.module.js';
@Module({
  imports: [DatabaseModule],
  providers: [LoansService],
  exports: [LoansService],
})
export class LoansModule {}