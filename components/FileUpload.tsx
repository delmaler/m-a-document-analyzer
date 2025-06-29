
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('Please upload a valid PDF file.');
      }
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled) {
      handleFile(e.dataTransfer.files);
    }
  }, [disabled]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFile(e.target.files);
  };

  const dropzoneClasses = `
    flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-lg cursor-pointer
    transition-colors duration-300 ease-in-out
    ${disabled 
        ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 cursor-not-allowed' 
        : isDragging 
        ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-500' 
        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400'
    }
  `;

  return (
    <div
      className={dropzoneClasses}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf"
        onChange={handleInputChange}
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
        <UploadIcon className={`w-10 h-10 mb-4 transition-colors duration-300 ${isDragging ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`} />
        <p className={`mb-2 text-lg font-semibold ${isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>
          Drop PDF here or click to upload
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Only .pdf files are supported
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
