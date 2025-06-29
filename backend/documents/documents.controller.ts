import { Controller, Post, Get, UseInterceptors, UploadedFile, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AnalysisDataDto, AnalyzeDocumentResponseDto } from './dto/analyze-document.dto';

@Controller('api/documents')
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);

  constructor(private readonly documentsService: DocumentsService) {}

  @Get('health')
  async healthCheck() {
    return { status: 'ok', message: 'Documents service is running' };
  }

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeDocument(@UploadedFile() file: Express.Multer.File): Promise<AnalyzeDocumentResponseDto> {
    this.logger.log(`Received analysis request for file: ${file?.originalname || 'unknown'}`);

    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      const result = await this.documentsService.analyzeDocument(file);
      
      return {
        message: 'Document analyzed successfully',
        data: result
      };
    } catch (error) {
      this.logger.error('Error in analyze endpoint:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          message: 'Analysis failed',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
