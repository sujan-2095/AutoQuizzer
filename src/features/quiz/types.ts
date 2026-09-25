export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  id: string;
  topic: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  createdAt: string;
  questions: Question[];
  lastScore?: number;
  timeLimitMinutes?: number;
}

export interface UserAnswer {
  questionIndex: number;
  selectedOption: number | null;
}

export interface QuizDraft {
  inputType: 'topic' | 'file';
  topic: string;
  customTitle: string;
  additionalContext: string;
  fileName: string;
  fileContent: string;
  numQuestions: number;
  difficulty: Difficulty;
  timeLimit: number;
}

export type FileProcessingState = 'idle' | 'extracting' | 'ready' | 'error';
