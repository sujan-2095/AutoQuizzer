export const buildQuizPrompt = ({ content, numQuestions, difficulty }) => {
  const difficultyInstruction = difficulty
    ? `2. The difficulty level must be exactly ${difficulty}.`
    : `2. Based on the complexity of the context, determine the most appropriate difficulty level for the quiz and include it in the 'difficulty' field. The value must be one of: 'Easy', 'Medium', or 'Hard'.`;

  return `
    Based on the provided context, generate a multiple-choice quiz.
    
    **Context:**
    ${content}
    
    **Instructions:**
    1. Create a quiz with exactly ${numQuestions} questions.
    ${difficultyInstruction}
    3. Each question must have exactly 4 options.
    4. Crucially, generate a concise, one-line description that summarizes the quiz content.
    5. Ensure the questions are relevant to the provided context.
    6. Provide the output in the specified JSON format.
    7. **IMPORTANT**: Do not create questions that refer to the document, the act of studying, or the source material itself. The questions must be about the subject matter directly. Avoid phrases like "According to the provided text...", "Based on the document...", "from the content", "by the given content", "by the provided file", "self study", and similar references. Also, do not include metadata from the document like course names or course codes in the questions or answers.
  `;
};

export default buildQuizPrompt;
