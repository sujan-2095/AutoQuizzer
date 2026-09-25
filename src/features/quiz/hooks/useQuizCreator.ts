import { useState, useCallback, useEffect, useRef } from 'react';
import { Difficulty, Quiz, QuizDraft, FileProcessingState } from '../types';
import { generateQuizFromContent } from '@/features/ai/services/geminiService';
import { getQuizDraft, saveQuizDraft, clearQuizDraft } from '../utils/quizDraftStorage';
import { extractPdfText } from '../utils/extractPdfText';
import { extractDocxText } from '../utils/extractDocxText';
import { extractPptxText } from '../utils/extractPptxText';

interface UseQuizCreatorProps {
  onQuizCreated: (quiz: Quiz) => void;
  setIsDirty: (isDirty: boolean) => void;
}

export const useQuizCreator = ({ onQuizCreated, setIsDirty }: UseQuizCreatorProps) => {
  const [topic, setTopic] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [timeLimit, setTimeLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileProcessingState, setFileProcessingState] = useState<FileProcessingState>('idle');
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [inputType, setInputType] = useState<'topic' | 'file'>('topic');
  const [timer, setTimer] = useState(0);
  const timerIntervalRef = useRef<number | null>(null);

  const [draft, setDraft] = useState<QuizDraft | null>(null);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [initialState, setInitialState] = useState<QuizDraft | null>(null);

  const getFormData = useCallback((): QuizDraft => {
    return {
      inputType,
      topic,
      customTitle,
      additionalContext,
      fileName,
      fileContent,
      numQuestions,
      difficulty,
      timeLimit,
    };
  }, [inputType, topic, customTitle, additionalContext, fileName, fileContent, numQuestions, difficulty, timeLimit]);

  useEffect(() => {
    const savedDraft = getQuizDraft();
    if (savedDraft) {
      setDraft(savedDraft);
      setShowDraftPrompt(true);
    } else {
      setInitialState(getFormData());
    }
  }, []); // Run only once on mount

  useEffect(() => {
    if (!initialState) return;

    const currentState = getFormData();
    const dirty = JSON.stringify(currentState) !== JSON.stringify(initialState);
    setIsDirty(dirty);
  }, [getFormData, initialState, setIsDirty]);

  useEffect(() => {
    if (isLoading) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setTimer(0);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isLoading]);

  const resetFileInputs = () => {
    setFileContent('');
    setFileName('');
    setError('');
    setFileProcessingState('idle');
    setProcessingMessage('');
  };

  const handleRestoreDraft = () => {
    if (draft) {
      setInputType(draft.inputType);
      setTopic(draft.topic);
      setCustomTitle(draft.customTitle);
      setAdditionalContext(draft.additionalContext);
      setFileName(draft.fileName);
      setFileContent(draft.fileContent);
      setNumQuestions(draft.numQuestions);
      setDifficulty(draft.difficulty);
      setTimeLimit(draft.timeLimit);
      setInitialState(draft);

      if (draft.inputType === 'file' && draft.fileContent) {
        setFileProcessingState('ready');
        setProcessingMessage('Restored document. Ready to generate quiz!');
      }
    }
    setShowDraftPrompt(false);
  };

  const handleDismissDraft = () => {
    clearQuizDraft();
    setInitialState(getFormData());
    setShowDraftPrompt(false);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    resetFileInputs();

    if (file) {
      setFileName(file.name);
      const extension = file.name.split('.').pop()?.toLowerCase() || '';

      setFileProcessingState('extracting');
      setProcessingMessage('Extracting text from file...');
      setError('');

      try {
        const arrayBuffer = await file.arrayBuffer();
        let fullText = '';

        switch (extension) {
          case 'pdf': {
            fullText = await extractPdfText(arrayBuffer);
            break;
          }
          case 'txt': {
            fullText = new TextDecoder().decode(arrayBuffer);
            break;
          }
          case 'docx': {
            fullText = await extractDocxText(arrayBuffer);
            break;
          }
          case 'pptx':
          case 'ppsx': {
            fullText = await extractPptxText(arrayBuffer);
            break;
          }
          default: {
            setError(`Unsupported file type. Please upload a .txt, .pdf, .docx, or .pptx/.ppsx file.`);
            setFileProcessingState('error');
            return;
          }
        }

        fullText = fullText.trim();
        setFileContent(fullText);

        setFileProcessingState('ready');
        setProcessingMessage('Document processed. Ready to generate quiz!');
      } catch (processingError) {
        console.error(`Error processing file:`, processingError);
        const errorMessage =
          processingError instanceof Error
            ? processingError.message
            : `Could not process the file. It might be corrupted or in an unsupported format.`;
        setError(errorMessage);
        setFileProcessingState('error');
      }
    }
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      let content: string;
      let quizTopic = topic;

      if (inputType === 'file') {
        content = fileContent;
        quizTopic = fileName.replace(/\.[^/.]+$/, '');
      } else {
        content = topic;
        if (additionalContext.trim()) {
          content += `\n\n**Additional Context to focus on:**\n${additionalContext.trim()}`;
        }
        quizTopic = topic;
      }

      if (!content.trim()) {
        setError('Please provide a topic or upload a valid file.');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const currentDifficulty = inputType === 'file' ? null : difficulty;
        const generatedData = await generateQuizFromContent({ content }, numQuestions, currentDifficulty);

        const newQuiz: Quiz = {
          id: new Date().toISOString(),
          topic: quizTopic,
          title: customTitle.trim() || generatedData.title,
          description: generatedData.description,
          questions: generatedData.questions,
          difficulty: generatedData.difficulty,
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          timeLimitMinutes: timeLimit,
        };
        clearQuizDraft();
        onQuizCreated(newQuiz);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [
      topic,
      fileContent,
      numQuestions,
      difficulty,
      onQuizCreated,
      inputType,
      fileName,
      timeLimit,
      customTitle,
      additionalContext,
    ]
  );

  const handleSaveDraft = () => {
    const draftData = getFormData();
    saveQuizDraft(draftData);
    setInitialState(draftData);
    setIsDirty(false);
  };

  const isFormInvalid =
    isLoading ||
    (inputType === 'topic' && !topic.trim()) ||
    (inputType === 'file' && (!fileContent || fileProcessingState !== 'ready'));

  return {
    topic,
    setTopic,
    customTitle,
    setCustomTitle,
    additionalContext,
    setAdditionalContext,
    fileContent,
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
  };
};
