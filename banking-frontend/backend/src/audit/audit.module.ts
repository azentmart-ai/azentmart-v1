
import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller.js';
import { AuditService } from './audit.service.js';

@Module({
  providers: [AuditService],
  exports: [AuditService],
  controllers: [AuditController],
})

export class AuditModule {}
