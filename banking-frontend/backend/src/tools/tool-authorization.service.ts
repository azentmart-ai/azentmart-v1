import { Injectable, ForbiddenException } from '@nestjs/common';
import { ToolRegistryService } from '../tool-registry/tool-registry.service.js';

@Injectable()
export class ToolAuthorizationService {
  constructor(
    private readonly toolRegistry: ToolRegistryService,
  ) {}

authorize(
  toolName: string,
  context: {
    authenticated: boolean;
    mfaVerified: boolean;
    confirmed: boolean;
  },
) {
  const tool = this.toolRegistry.getTool(toolName);

  if (!tool) {
    throw new ForbiddenException(
      `Tool '${toolName}' is not registered`,
    );
  }

  if (tool.requiresAuthentication && !context.authenticated) {
    throw new ForbiddenException(
      `Authentication required for tool '${toolName}'`,
    );
  }

  if (tool.requiresMFA && !context.mfaVerified) {
    throw new ForbiddenException(
      `MFA verification required for tool '${toolName}'`,
    );
  }

  if (tool.requiresApproval && !context.confirmed) {
    throw new ForbiddenException(
      `User confirmation required for tool '${toolName}'`,
    );
  }

  return {
    authorized: true,
    tool: toolName,
  };
}
}