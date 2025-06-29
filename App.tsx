import React, { useState, useCallback } from 'react';
import { AppState, type AnalysisData } from './types';
import { analyzeDocument, ApiError } from './services/apiService';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { LogoIcon } from './components/Icons';

export default function App(): React.ReactNode {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    setAppState(AppState.PROCESSING);
    setError(null);
    setAnalysisResult(null);
    setFileName(file.name);

    try {
      const result = await analyzeDocument(file);
      setAnalysisResult(result);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      let errorMessage = "An unknown error occurred.";
      
      if (err instanceof ApiError) {
        if (err.status === 0) {
          errorMessage = "Network error: Unable to connect to the server. Please check if the backend is running.";
        } else if (err.status === 400) {
          errorMessage = `Bad Request: ${err.message}`;
        } else if (err.status === 413) {
          errorMessage = "File too large. Please upload a smaller file.";
        } else if (err.status >= 500) {
          errorMessage = "Server error: The analysis service is currently unavailable. Please try again later.";
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(`Analysis Failed: ${errorMessage}`);
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setError(null);
    setFileName(null);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.PROCESSING:
        return (
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Analyzing "{fileName}"...
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">This may take a moment.</p>
          </div>
        );
      case AppState.SUCCESS:
        return analysisResult && (
          <AnalysisResult data={analysisResult} onReset={handleReset} fileName={fileName || ''} />
        );
      case AppState.ERROR:
        return <ErrorMessage message={error} onReset={handleReset} />;
      case AppState.IDLE:
      default:
        return <FileUpload onFileSelect={handleFileSelect} disabled={false} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-2">
                <LogoIcon className="h-10 w-10 text-blue-600" />
                <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    M&A Document Analyzer
                </h1>
            </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Instantly extract key deal terms from your acquisition agreements.
          </p>
        </header>
        <main className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-10 transition-shadow duration-300">
            {renderContent()}
        </main>
        <footer className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
            <p>Powered by React, NestJS, and Anthropic Claude API</p>
            <p>&copy; {new Date().getFullYear()} Legal Tech Innovations. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}