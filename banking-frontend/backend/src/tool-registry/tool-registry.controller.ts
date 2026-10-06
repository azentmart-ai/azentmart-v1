import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ToolRegistryService } from './tool-registry.service.js';
import { ToolExecutorService } from './tool-executor.service.js';

@Controller('tools')
export class ToolRegistryController {
  constructor(
    private readonly toolRegistryService: ToolRegistryService,
    private readonly toolExecutor: ToolExecutorService,
  ) {}

  @Get()
  getTools() {
    return this.toolRegistryService.getAllTools();
  }

  @Get(':name')
  getTool(@Param('name') name: string) {
    return this.toolRegistryService.getTool(name);
  }

@Post('execute')
executeTool(
  @Body()
  body: {
    tool?: string;
    toolName?: string;
    args?: any;
  },
) {
  const toolName = body.tool ?? body.toolName;

  if (!toolName) {
    return {
      success: false,
      message: 'Tool name is required',
    };
  }

  return this.toolExecutor.execute(
    toolName,
    body.args,
  );
}


}
