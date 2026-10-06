import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(email: string, password: string) {
    if (
      email === 'admin@example.com' &&
      password === '123456'
    ) {
      return {
        success: true,
        customerId: 'C123',
        msg: 'Login successful',
      };
    }

    return {
      success: false,
      msg: 'Invalid credentials',
    };
  }
}

