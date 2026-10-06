import { Injectable } from '@nestjs/common';
import { BankingAgentState } from './agent-state.types.js';

@Injectable()
export class AgentStateService {
  private readonly states = new Map<string, BankingAgentState>();

  createState(
    conversationId: string,
    customerId: string,
    tenantId = 'TENANT001',
    channel = 'WEB',
  ): BankingAgentState {
    const state: BankingAgentState = {
      conversationId,
      tenantId,
      customerId,
      channel,

      authenticationStatus: 'AUTHENTICATED',

      approvalRequired: false,

      workflowStatus: 'STARTED',

      auditId: `AUDIT-${Date.now()}`,
    };

    this.states.set(conversationId, state);

    return state;
  }

  getState(
    conversationId: string,
  ): BankingAgentState | undefined {
    return this.states.get(conversationId);
  }

  updateState(
    conversationId: string,
    updates: Partial<BankingAgentState>,
  ): BankingAgentState {
    const existing = this.states.get(conversationId);

    if (!existing) {
      throw new Error(
        `Agent state not found for conversation ${conversationId}`,
      );
    }

    const updated: BankingAgentState = {
      ...existing,
      ...updates,
    };

    this.states.set(conversationId, updated);

    return updated;
  }
}