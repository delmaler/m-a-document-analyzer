
export interface AnalysisData {
  dealValue: string;
  buyerName: string;
  sellerName: string;
  signingDate: string;
  closingDate: string;
  conditionsPrecedent: string[];
}

export enum AppState {
    IDLE = 'idle',
    PROCESSING = 'processing',
    SUCCESS = 'success',
    ERROR = 'error',
}
