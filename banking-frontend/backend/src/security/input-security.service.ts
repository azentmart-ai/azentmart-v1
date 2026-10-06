import { Injectable } from '@nestjs/common';

@Injectable()
export class InputSecurityService {
  check(input: string) {
    const suspiciousPatterns = [
      /ignore previous instructions/i,
      /ignore all instructions/i,
      /bypass.*security/i,
      /bypass.*authentication/i,
      /disable.*mfa/i,
      /transfer all money/i,
      /reveal.*system prompt/i,
      /show.*system prompt/i,
    ];

    const suspicious = suspiciousPatterns.some((pattern) =>
      pattern.test(input),
    );

    return {
      safe: !suspicious,
      reason: suspicious
        ? 'Potential prompt injection detected'
        : 'Input appears safe',
    };
  }
}