import React from 'react';
import { DocumentIcon, SpinnerIcon, CheckIcon } from '@/components/ui/Icons';
import { FileProcessingState } from '../types';

interface FileUploaderProps {
  fileName: string;
  fileProcessingState: FileProcessingState;
  processingMessage: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  fileName,
  fileProcessingState,
  processingMessage,
  onFileChange,
}) => {
  const isFileProcessing = fileProcessingState === 'extracting';

  return (
    <div className="animate-fade-in space-y-3">
      <label htmlFor="file" className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-1">
        Upload File
      </label>
      <label
        className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-border dark:border-border rounded-lg transition-all duration-300 ${
          isFileProcessing
            ? 'cursor-wait bg-primary-light/10 dark:bg-primary/10 border-primary-light dark:border-primary'
            : 'cursor-pointer hover:border-primary-light dark:hover:border-primary hover:bg-primary-light/10 dark:hover:bg-primary/10 transform hover:scale-[1.02]'
        }`}
      >
        {isFileProcessing ? (
          <div className="flex items-center text-primary-light dark:text-primary">
            <SpinnerIcon className="h-6 w-6 text-primary-light dark:text-primary mr-3 animate-spin" />
            <span className="text-sm text-primary-light dark:text-primary font-medium">{processingMessage}</span>
          </div>
        ) : (
          <>
            <DocumentIcon className="h-6 w-6 text-text-light-muted dark:text-text-muted mr-3" />
            <span className="text-sm text-text-light-muted dark:text-text-muted font-medium">
              {fileName || 'Upload .txt, .pdf, .docx, or .pptx/.ppsx'}
            </span>
          </>
        )}
        <input
          id="file"
          type="file"
          accept=".txt,.pdf,.docx,.pptx,.ppsx"
          onChange={onFileChange}
          className="hidden"
          disabled={isFileProcessing}
        />
      </label>
      {fileProcessingState === 'ready' && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-300 text-xs rounded-lg p-2 flex items-center space-x-2">
          <CheckIcon className="h-4 w-4 flex-shrink-0" />
          <p className="font-medium">{processingMessage}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
