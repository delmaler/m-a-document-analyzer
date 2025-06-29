import { IsString, IsArray, IsOptional } from 'class-validator';

export class AnalysisDataDto {
  @IsString()
  dealValue: string;

  @IsString()
  buyerName: string;

  @IsString()
  sellerName: string;

  @IsString()
  signingDate: string;

  @IsString()
  closingDate: string;

  @IsArray()
  @IsString({ each: true })
  conditionsPrecedent: string[];
}

export class AnalyzeDocumentResponseDto {
  @IsString()
  message: string;

  @IsOptional()
  data?: AnalysisDataDto;

  @IsOptional()
  @IsString()
  error?: string;
} 