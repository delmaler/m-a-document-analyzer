import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { AnalysisDataDto } from '../documents/dto/analyze-document.dto';

type ClaudeResponse = { content: { text: string }[] };

@Injectable()
export class ClaudeService {
  private readonly logger = new Logger(ClaudeService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string = 'https://api.anthropic.com/v1/messages';
  private readonly model: string = 'claude-3-opus-20240229'; // You can change to another Claude model if needed
  private readonly enableEnhancement: boolean;

  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    if (!this.apiKey) {
      throw new Error('CLAUDE_API_KEY environment variable is required');
    }
    
    // Parse boolean environment variable
    const enhancementFlag = process.env.ENABLE_ANALYSIS_ENHANCEMENT;
    this.enableEnhancement = enhancementFlag === 'true' ;
    this.logger.log(`Analysis enhancement is ${this.enableEnhancement ? 'enabled' : 'disabled'}`);
  }
  private getPromptforEnhancing(): string {
    return `
You are an expert legal assistant specializing in Mergers & Acquisitions. Your task is to analyze the provided input in the following format:

{
  "agreement: "string",
  "dealValue": "string",
  "buyerName": "string",
  "sellerName": "string",
  "signingDate": "string",
  "closingDate": "string",
  "conditionsPrecedent": ["string"]
}
  and see of all the fields other than "agreement" match the information in the agreement. if they don't, please enhance the information in the agreement to make it more accurate. otherwise, return the original JSON object.
  please return the JSON object with the following structure:
  {
  "dealValue": "string",
  "buyerName": "string",
  "sellerName": "string",
  "signingDate": "string",
  "closingDate": "string",
  "conditionsPrecedent": ["string"]
  }
Please extract the following information and return it as a single, valid JSON object. Do not include any explanatory text, comments, or markdown formatting like \`\`\`json. Your entire response must be only the JSON object.
`;
  }
  private getPrompt(): string {
    return `
You are an expert legal assistant specializing in Mergers & Acquisitions. Your task is to analyze the provided acquisition agreement document and extract key deal terms.

Please extract the following information and return it as a single, valid JSON object. Do not include any explanatory text, comments, or markdown formatting like \`\`\`json. Your entire response must be only the JSON object.

The JSON object must have the following structure:
{
  "dealValue": "string",
  "buyerName": "string",
  "sellerName": "string",
  "signingDate": "string",
  "closingDate": "string",
  "conditionsPrecedent": ["string"]
}

Instructions for extraction:
- dealValue: Find the total purchase price or consideration for the deal. Express it clearly (e.g., "$500 Million USD").
- buyerName: Identify the full legal name of the acquiring entity.
- sellerName: Identify the full legal name of the selling entity.
- signingDate: Find the date the agreement was executed or signed.
- closingDate: Find the target or actual closing date of the transaction.
- conditionsPostcedent: List key conditions that must be met after the deal is closed. This should be an array of strings. Summarize each condition concisely in one sentence.try to find at least a few conditions.

If any piece of information cannot be found in the text, use the string "Not specified" for that field. For 'conditionsPrecedent', if none are found, return an empty array [].
`;
  }

  private async enhanceAnalysisData(parsedData: any, text: string): Promise<any> {
    this.logger.log('Starting enhancing the data with Claude');
    parsedData.agreement = text;
    const responseEnhance = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        max_tokens: 2048,
        messages: [
            { role: 'user', content: this.getPromptforEnhancing() + '\n\n' + JSON.stringify(parsedData) }
        ]
      },
      {
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );
    
    // Extract enhanced data from responseEnhance
    const enhancedData = responseEnhance.data as ClaudeResponse;
    let enhancedJsonStr = enhancedData.content?.[0]?.text?.trim() || '';
    
    // Remove markdown code fences if present
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const enhancedMatch = enhancedJsonStr.match(fenceRegex);
    if (enhancedMatch && enhancedMatch[2]) {
      enhancedJsonStr = enhancedMatch[2].trim();
    }
    
    // Parse the enhanced response and update parsedData
    const enhancedParsedData = JSON.parse(enhancedJsonStr);
    
    // Update parsedData with enhanced information
    parsedData.dealValue = enhancedParsedData.dealValue || parsedData.dealValue;
    parsedData.buyerName = enhancedParsedData.buyerName || parsedData.buyerName;
    parsedData.sellerName = enhancedParsedData.sellerName || parsedData.sellerName;
    parsedData.signingDate = enhancedParsedData.signingDate || parsedData.signingDate;
    parsedData.closingDate = enhancedParsedData.closingDate || parsedData.closingDate;
    parsedData.conditionsPrecedent = enhancedParsedData.conditionsPrecedent || parsedData.conditionsPrecedent;
    
    this.logger.log('Claude output enhancement completed successfully');
    return parsedData;
  }

  async analyzeDocumentFromText(text: string): Promise<AnalysisDataDto> {
    this.logger.log('Starting analysis with Claude for text input');
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          max_tokens: 2048,
          messages: [
            { role: 'user', content: this.getPrompt() + '\n\n' + text }
          ]
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
        }
      );

      const data = response.data as ClaudeResponse;
      let jsonStr = data.content?.[0]?.text?.trim() || '';
      // Remove markdown code fences if present
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      let parsedData = JSON.parse(jsonStr);
      // validate the response structure
      if (
        typeof parsedData.dealValue !== 'string' ||
        typeof parsedData.buyerName !== 'string' ||
        typeof parsedData.sellerName !== 'string' ||
        !Array.isArray(parsedData.conditionsPrecedent)
      ) {
        throw new Error('Claude returned data in an unexpected format.');
      }
      this.logger.log('Claude document analysis completed successfully');
      this.logger.log('parsedData', parsedData);
      
      // Conditionally enhance the data based on environment variable
      if (this.enableEnhancement) {
        this.logger.log('starting to enhance the data');
        parsedData = await this.enhanceAnalysisData(parsedData, text);
      } else {
        this.logger.log('skipping data enhancement (disabled by environment variable)');
        this.logger.log('enableEnhancement', this.enableEnhancement);
      }
      
      return parsedData as AnalysisDataDto;
    } catch (error) {
      this.logger.error('Error analyzing document with Claude:', error);
      if (error instanceof Error && error.message.includes('parse')) {
        throw new Error('Failed to parse the analysis from Claude. The response may not be valid JSON.');
      }
      throw new Error('Failed to get analysis from the Claude service.');
    }
  }
} 