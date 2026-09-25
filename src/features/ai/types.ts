import { Quiz, Difficulty } from '../quiz/types';

export type GeneratedQuizData = Pick<Quiz, 'title' | 'description' | 'questions' | 'difficulty'>;

export interface GenerationOptions {
  content: string;
}

export interface SummarizeProgress {
  status: string;
  progress?: number;
}
