import { Injectable } from '@nestjs/common';
import { CoreBankingAdapter } from './core-banking.adapter.js';
import {
  GatewayTimeoutException,
} from './gateway-timeout.exception.js';
import { CircuitBreakerService } from './circuit-breaker.service.js';
import { ResponseNormalizerService } from './response-normalizer.service.js';
import { IntegrationObservabilityService } from './integration-observability.service.js';
import { RedisRateLimiterService } from '../redis/redis-rate-limiter.service.js';
@Injectable()
export class IntegrationGatewayService {
  constructor(
    private readonly coreBanking: CoreBankingAdapter,
    private readonly circuitBreaker: CircuitBreakerService,
    private readonly responseNormalizer: ResponseNormalizerService,
    private readonly observability: IntegrationObservabilityService,
    private readonly rateLimiter: RedisRateLimiterService,
  ) {}
 
  private async withTimeout<T>(
    operation: Promise<T>,
    timeoutMs = 5000,
  ): Promise<T> {
    let timeoutHandle: NodeJS.Timeout;
    const timeout = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(
          new GatewayTimeoutException(
            'Core banking request timed out',
          ),
        );
      }, timeoutMs);
    });

    try {
      return await Promise.race([operation, timeout]);
    } finally {
      clearTimeout(timeoutHandle!);
    }
  }
  private async withRetry<T>(
  operation: () => Promise<T>,
  retries = 2,
  delayMs = 500,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        throw lastError;
      }

      await new Promise(resolve =>
        setTimeout(resolve, delayMs),
      );
    }
  }

  throw lastError;
}
  async getBalance(customerId: string) {
    return this.coreBanking.getBalance(customerId);
  }

  async getTransactions(customerId: string) {
    return this.coreBanking.getTransactions(customerId);
  }

async executeTransfer(
  transferId: string,
  fromCustomerId: string,
  toCustomerId: string,
  amount: number,
  idempotencyKey: string,
) {
  try {
       this.validateTransferRequest(
      transferId,
      fromCustomerId,
      toCustomerId,
      amount,
      idempotencyKey,
    );
    const allowed = await this.rateLimiter.checkLimit(fromCustomerId);

if (!allowed) {
  throw new Error(
    'Rate limit exceeded. Too many transfer requests. Please try again later.',
  );
}
    const response = await this.circuitBreaker.execute(async () => {
      const result = await this.withTimeout(
        this.withRetry(
          () =>
            this.coreBanking.executeTransfer(
              transferId,
              fromCustomerId,
              toCustomerId,
              amount,
              idempotencyKey,
            ),
          2,
          500,
        ),
      );

      return this.responseNormalizer.normalizeTransferResponse(
        result,
      );
    });

    this.observability.logSuccess('executeTransfer', {
      transferId,
      status: response.status,
    });

    return response;
  } catch (error) {
    this.observability.logFailure(
      'executeTransfer',
      error,
      {
        transferId,
      },
    );

    throw error;
  }
}

  async getLoans(customerId: string) {
    return this.coreBanking.getLoans(customerId);
  }

  async getLoanBalance(
    customerId: string,
    loanId: string,
  ) {
    return this.coreBanking.getLoanBalance(
      customerId,
      loanId,
    );

  }
  private validateTransferRequest(
  transferId: string,
  fromCustomerId: string,
  toCustomerId: string,
  amount: number,
  idempotencyKey?: string,
) {
  if (!transferId) {
    throw new Error('transferId is required');
  }

  if (!fromCustomerId) {
    throw new Error('fromCustomerId is required');
  }

  if (!toCustomerId) {
    throw new Error('toCustomerId is required');
  }

  if (fromCustomerId === toCustomerId) {
    throw new Error('Sender and receiver cannot be the same');
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Transfer amount must be greater than 0');
  }

  if (!idempotencyKey) {
    throw new Error('idempotencyKey is required');
  }
}
}