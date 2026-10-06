import { GatewayTimeoutException as NestGatewayTimeoutException } from '@nestjs/common';

export class GatewayTimeoutException extends NestGatewayTimeoutException {
  constructor(message = 'Core banking request timed out') {
    super(message);
  }
}