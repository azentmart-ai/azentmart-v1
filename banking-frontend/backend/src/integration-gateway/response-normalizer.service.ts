import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseNormalizerService {
  normalizeTransferResponse(response: any) {
    return {
      success: response?.success ?? false,
      transferId: response?.transferId ?? null,
      transactionId: response?.transactionId ?? null,
      status: response?.status ?? 'UNKNOWN',
      message: response?.message ?? 'Transfer completed',
    };
  }
}