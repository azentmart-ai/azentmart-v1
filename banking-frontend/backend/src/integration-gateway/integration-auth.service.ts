import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationAuthService {
getAuthHeaders(): Record<string, string> {
  const apiKey = process.env.CORE_BANKING_API_KEY;

  if (!apiKey) {
    throw new Error('Core Banking API key is not configured');
  }

  return {
    Authorization: `Bearer ${apiKey}`,
  };
}
}