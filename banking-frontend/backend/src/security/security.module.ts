import { Module } from '@nestjs/common';
import { InputSecurityService } from './input-security.service.js';

@Module({
  providers: [InputSecurityService],
  exports: [InputSecurityService],
})
export class SecurityModule {}