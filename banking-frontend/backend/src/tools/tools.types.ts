export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ToolDefinition {
  name: string;
  description: string;
  riskLevel: RiskLevel;
  requiresAuthentication: boolean;
  requiresMFA: boolean;
  requiresApproval: boolean;
}