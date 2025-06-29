import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { ClaudeService } from '../services/claude.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, ClaudeService],
  exports: [DocumentsService],
})
export class DocumentsModule {
  constructor() {
    console.log('Claude API Key:', process.env.CLAUDE_API_KEY);
  }
}
