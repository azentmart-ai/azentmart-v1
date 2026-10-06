import { Injectable } from '@nestjs/common';

@Injectable()
export class MfaService {
  private otp = '123456';

  private verifiedCustomers = new Set<string>();

  generateOtp(customerId: string) {
    return {
      success: true,
      customerId,
      message: 'OTP generated successfully',
      otp: this.otp,
      expiresIn: 300,
    };
  }

  verifyOtp(customerId: string, otp: string) {
    if (otp !== this.otp) {
      return {
        success: false,
        message: 'Invalid OTP',
        verified: false,
      };
    }

    this.verifiedCustomers.add(customerId);
console.log('MFA VERIFIED SET:', [...this.verifiedCustomers]);
    return {
      success: true,
      customerId,
      message: 'MFA verification successful',
      verified: true,
    };
  }

 isVerified(customerId: string) {
  console.log('MFA CHECK:', {
    customerId,
    verifiedCustomers: [...this.verifiedCustomers],
  });

  return this.verifiedCustomers.has(customerId);
}
}