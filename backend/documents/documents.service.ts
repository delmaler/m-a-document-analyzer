import { Injectable, Logger } from '@nestjs/common';
import { ClaudeService } from '../services/claude.service';
import { AnalysisDataDto } from './dto/analyze-document.dto';
const pdfParse = require('pdf-parse');

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private readonly claudeService: ClaudeService
  ) {}

  async analyzeDocument(file: Express.Multer.File): Promise<AnalysisDataDto> {
    this.logger.log(`Processing document analysis request for file: ${file.originalname}`);
    
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    const allowedMimeTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload a file smaller than 10MB.');
    }

    try {
      if (file.mimetype === 'application/pdf') {
        const data = await pdfParse(file.buffer);
        const text = data.text;
        return this.claudeService.analyzeDocumentFromText(text);
      }
      // thought: I've added this for the case where the file is a text file. I don't know if it's needed.
      if (file.mimetype === 'text/plain') {
        const text = file.buffer.toString('utf-8');
        return this.claudeService.analyzeDocumentFromText(text);
      }
      if (file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const text = file.buffer.toString('utf-8');
        return this.claudeService.analyzeDocumentFromText(text);
      }
      // throww error for other types
      throw new Error('Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.');
    } catch (error) {
      this.logger.error('Error in document analysis:', error);
      throw error;
    }
  }
}
