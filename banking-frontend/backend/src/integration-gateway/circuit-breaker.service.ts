import { Injectable } from '@nestjs/common';

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

@Injectable()
export class CircuitBreakerService {
  private state = CircuitState.CLOSED;

  private failureCount = 0;

  private readonly failureThreshold = 3;

  private readonly cooldownMs = 10_000;

  private openedAt?: number;

  async execute<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    this.checkState();

    try {
      const result = await operation();

      this.onSuccess();

      return result;
    } catch (error) {
      this.onFailure();

      throw error;
    }
  }

  private checkState() {
    if (this.state === CircuitState.CLOSED) {
      return;
    }

    if (this.state === CircuitState.OPEN) {
      const elapsed = Date.now() - (this.openedAt ?? 0);

      if (elapsed >= this.cooldownMs) {
        this.state = CircuitState.HALF_OPEN;
        return;
      }

      throw new Error(
        'Circuit breaker is open. Core banking service temporarily unavailable.',
      );
    }

    // HALF_OPEN allows one request to test recovery.
  }

  private onSuccess() {
    this.failureCount = 0;
    this.openedAt = undefined;
    this.state = CircuitState.CLOSED;
  }

  private onFailure() {
    this.failureCount++;

    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.openedAt = Date.now();
    }
  }
}