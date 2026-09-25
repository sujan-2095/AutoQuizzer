import React, { forwardRef, useImperativeHandle } from 'react';
import { Quiz, QuizDraft } from '../types';
import { LightBulbIcon, DocumentIcon, ExclamationIcon } from '@/components/ui/Icons';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useQuizCreator } from '../hooks/useQuizCreator';
import TopicInput from '../components/TopicInput';
import FileUploader from '../components/FileUploader';
import DifficultySelector from '../components/DifficultySelector';
import QuestionCountSelector from '../components/QuestionCountSelector';

export interface QuizCreatorProps {
  onQuizCreated: (quiz: Quiz) => void;
  onCancel: () => void;
  setIsDirty: (isDirty: boolean) => void;
}

export const QuizCreator = forwardRef<{ getDraftData: () => QuizDraft }, QuizCreatorProps>(
  ({ onQuizCreated, onCancel, setIsDirty }, ref) => {
    const {
      topic,
      setTopic,
      customTitle,
      setCustomTitle,
      additionalContext,
      setAdditionalContext,
      fileName,
      numQuestions,
      setNumQuestions,
      difficulty,
      setDifficulty,
      timeLimit,
      setTimeLimit,
      isLoading,
      fileProcessingState,
      processingMessage,
      error,
      inputType,
      setInputType,
      timer,
      showDraftPrompt,
      isFormInvalid,
      getFormData,
      handleRestoreDraft,
      handleDismissDraft,
      handleFileChange,
      handleSubmit,
      handleSaveDraft,
    } = useQuizCreator({ onQuizCreated, setIsDirty });

    useImperativeHandle(
      ref,
      () => ({
        getDraftData: () => {
          return getFormData();
        },
      }),
      [getFormData]
    );

    return (
      <div className="max-w-2xl mx-auto bg-surface dark:bg-surface p-8 rounded-2xl shadow-xl animate-fade-in border border-border dark:border-border">
        {showDraftPrompt && (
          <div className="mb-6 p-4 bg-primary-light/10 dark:bg-primary/10 border border-primary-light/30 dark:border-primary/30 rounded-lg flex items-center justify-between animate-fade-in">
            <div>
              <h3 className="font-semibold text-primary-light dark:text-primary">Resume your draft?</h3>
              <p className="text-sm text-text-light-muted dark:text-text-muted">You have a previously saved draft.</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDismissDraft}
                className="px-3 py-1.5 text-xs font-semibold text-text-light-muted dark:text-text-muted hover:bg-surface-light dark:hover:bg-surface-light rounded-md transition-all duration-300 transform hover:scale-105"
              >
                Discard
              </button>
              <button
                onClick={handleRestoreDraft}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-primary-light dark:bg-primary hover:bg-primary-light-hover dark:hover:bg-primary-hover rounded-md transition-all duration-300 transform hover:scale-105"
              >
                Restore
              </button>
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary-light via-primary-light to-primary-light-hover dark:from-primary dark:via-primary dark:to-primary-hover bg-clip-text text-transparent animate-fade-in">
          Create Your Quiz
        </h1>
        <p className="text-center text-text-light-muted dark:text-text-muted mb-8 animate-slide-up">
          Let AI craft the perfect quiz from your topic or document.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-background dark:bg-background p-1.5 rounded-lg flex space-x-2">
            <button
              type="button"
              onClick={() => setInputType('topic')}
              className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-all duration-300 flex items-center justify-center transform hover:scale-105 ${
                inputType === 'topic'
                  ? 'bg-primary-light dark:bg-primary text-white shadow-md shadow-primary-light/20 dark:shadow-primary/20'
                  : 'text-text-light-muted dark:text-text-muted hover:bg-surface-light dark:hover:bg-surface-light'
              }`}
            >
              <LightBulbIcon className="inline-block mr-2 h-5 w-5" />
              From Topic
            </button>
            <button
              type="button"
              onClick={() => setInputType('file')}
              className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-all duration-300 flex items-center justify-center transform hover:scale-105 ${
                inputType === 'file'
                  ? 'bg-primary-light dark:bg-primary text-white shadow-md shadow-primary-light/20 dark:shadow-primary/20'
                  : 'text-text-light-muted dark:text-text-muted hover:bg-surface-light dark:hover:bg-surface-light'
              }`}
            >
              <DocumentIcon className="inline-block mr-2 h-5 w-5" />
              From File
            </button>
          </div>

          <div>
            <label htmlFor="customTitle" className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-1">
              Quiz Title (Optional)
            </label>
            <input
              id="customTitle"
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Enter a custom title for your quiz"
              className="w-full px-4 py-2 bg-background dark:bg-background border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary focus:border-transparent transition-all duration-300 text-text dark:text-text-DEFAULT placeholder:text-text-light-muted dark:placeholder:text-text-muted"
            />
          </div>

          {inputType === 'topic' ? (
            <TopicInput
              topic={topic}
              onTopicChange={setTopic}
              additionalContext={additionalContext}
              onAdditionalContextChange={setAdditionalContext}
            />
          ) : (
            <FileUploader
              fileName={fileName}
              fileProcessingState={fileProcessingState}
              processingMessage={processingMessage}
              onFileChange={handleFileChange}
            />
          )}

          <div className={`grid grid-cols-1 ${inputType === 'topic' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
            <QuestionCountSelector
              numQuestions={numQuestions}
              onNumQuestionsChange={setNumQuestions}
              timeLimit={timeLimit}
              onTimeLimitChange={setTimeLimit}
            />
            {inputType === 'topic' && (
              <DifficultySelector difficulty={difficulty} onDifficultyChange={setDifficulty} />
            )}
          </div>

          {error && (
            <div className="bg-danger-surface border border-danger/80 text-red-400 text-sm rounded-lg p-3 flex items-start space-x-3 animate-slide-up">
              <ExclamationIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-sm font-semibold text-text-light-muted dark:text-text-muted hover:bg-surface-light dark:hover:bg-surface-light rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-semibold text-primary-light dark:text-primary hover:bg-primary-light/10 dark:hover:bg-primary/10 rounded-lg transition-all duration-300 border border-primary-light/50 dark:border-primary/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isFormInvalid}
              className="w-48 flex justify-center items-center bg-primary-light dark:bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-light-hover dark:hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-background focus:ring-primary-light dark:focus:ring-primary disabled:bg-surface-light dark:disabled:bg-surface-light disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-primary-light/40 dark:hover:shadow-primary/40 transform hover:-translate-y-0.5"
            >
              {isLoading ? <LoadingSpinner text={`Generating... ${timer}s`} /> : 'Generate Quiz'}
            </button>
          </div>
        </form>
      </div>
    );
  }
);

export default QuizCreator;
