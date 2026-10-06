
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  private logs: any[] = [];

  log(entry: any) {
    const auditEntry = {
      id: `AUDIT${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };

    this.logs.push(auditEntry);

    return auditEntry;
  }

  getLogs() {
    return this.logs;
  }
}


