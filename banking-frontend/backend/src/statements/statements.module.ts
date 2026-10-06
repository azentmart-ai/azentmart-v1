import { Module } from '@nestjs/common';
import { StatementsService } from './statements.service.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  providers: [StatementsService],
  exports: [StatementsService],
})
export class StatementsModule {}