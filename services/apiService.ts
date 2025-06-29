import { type AnalysisData } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    let errorData: any = null;

    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.error || errorResponse.message || errorMessage;
      errorData = errorResponse;
    } catch {
      // If we can't parse the error response, use the default message
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  return response.json();
}

export async function analyzeDocument(file: File): Promise<AnalysisData> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/documents/analyze`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let the browser set it with the boundary
    });

    const result: ApiResponse<AnalysisData> = await handleResponse(response);

    if (!result.data) {
      throw new ApiError('No data received from server', response.status, result);
    }

    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network errors or other issues
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
} 