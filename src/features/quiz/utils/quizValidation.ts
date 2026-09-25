import { Difficulty, Quiz } from '../types';

export const validateQuizContent = (
  inputType: 'topic' | 'file',
  topic: string,
  fileContent: string
): { isValid: boolean; error?: string } => {
  if (inputType === 'file') {
    if (!fileContent.trim()) {
      return { isValid: false, error: 'Please upload a valid file with extractable content.' };
    }
  } else {
    if (!topic.trim()) {
      return { isValid: false, error: 'Please provide a quiz topic.' };
    }
  }
  return { isValid: true };
};

export const validateQuizData = (quizData: any): void => {
  if (
    !quizData ||
    !quizData.questions ||
    !Array.isArray(quizData.questions) ||
    quizData.questions.length === 0 ||
    !quizData.difficulty ||
    !Object.values(Difficulty).includes(quizData.difficulty)
  ) {
    throw new Error('The AI model returned a quiz with an invalid format. Please try again.');
  }

  if (
    quizData.questions.some(
      (q: any) =>
        !q.questionText ||
        !q.options ||
        q.options.length !== 4 ||
        q.correctAnswerIndex === undefined ||
        q.correctAnswerIndex < 0 ||
        q.correctAnswerIndex >= 4
    )
  ) {
    throw new Error('The AI model returned one or more malformed questions. Please try again.');
  }
};
