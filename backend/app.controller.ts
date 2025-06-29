import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      message: 'M&A Document Analyzer API is running',
      timestamp: new Date().toISOString()
    };
  }
} 