import { Body, Controller, Post } from '@nestjs/common';
import { MfaService } from './mfa.service.js';

@Controller('mfa')
export class MfaController {
  constructor(private readonly mfaService: MfaService) {}

  @Post('generate')
  generateOtp(@Body() body: { customerId: string }) {
    return this.mfaService.generateOtp(body.customerId);
  }

  @Post('verify')
  verifyOtp(
    @Body()
    body: {
      customerId: string;
      otp: string;
    },
  ) {
    return this.mfaService.verifyOtp(
      body.customerId,
      body.otp,
    );
  }
}