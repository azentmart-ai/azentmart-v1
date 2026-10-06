import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IntegrationObservabilityService {
  private readonly logger = new Logger(
    IntegrationObservabilityService.name,
  );

  logSuccess(
    operation: string,
    metadata: Record<string, any> = {},
  ) {
    this.logger.log({
      operation,
      status: 'SUCCESS',
      ...metadata,
    });
  }

  logFailure(
    operation: string,
    error: unknown,
    metadata: Record<string, any> = {},
  ) {
    this.logger.error({
      operation,
      status: 'FAILURE',
      error:
        error instanceof Error
          ? error.message
          : String(error),
      ...metadata,
    });
  }
}
