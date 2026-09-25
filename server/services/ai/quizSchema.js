import { Type } from '@google/genai';

export const quizSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A creative and relevant title for the quiz based on the provided context."
    },
    description: {
      type: Type.STRING,
      description: "A concise, one-line summary of the quiz's content."
    },
    difficulty: {
      type: Type.STRING,
      description: "The estimated difficulty of the quiz. Must be one of 'Easy', 'Medium', or 'Hard'."
    },
    questions: {
      type: Type.ARRAY,
      description: "An array of quiz questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          questionText: {
            type: Type.STRING,
            description: "The text of the multiple-choice question."
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 possible answers for the question.",
            items: {
              type: Type.STRING
            }
          },
          correctAnswerIndex: {
            type: Type.INTEGER,
            description: "The 0-based index of the correct answer in the 'options' array."
          }
        },
        required: ["questionText", "options", "correctAnswerIndex"]
      }
    }
  },
  required: ["title", "description", "questions", "difficulty"]
};

export default quizSchema;
