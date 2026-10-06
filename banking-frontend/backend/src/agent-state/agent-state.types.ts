export interface BankingAgentState {
  conversationId: string;
  tenantId: string;
  customerId: string;
  channel: string;

  intent?: string;
  authenticationStatus: string;

  riskScore?: number;

  accountId?: string;
  transactionId?: string;

  selectedTool?: string;
  toolResult?: unknown;

  approvalRequired: boolean;
  approvalStatus?: string;

  workflowStatus: string;

  auditId: string;
}