import { getDatabase, saveDatabase } from '../database/db.js';

export const quizRepository = {
  findQuizzesByUserId(userId) {
    const db = getDatabase();
    const result = db.exec(
      `
      SELECT id, topic, title, description, difficulty, created_at, 
             questions, last_score, time_limit_minutes
      FROM quizzes 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `,
      [userId]
    );

    const quizzes = [];
    if (result[0]?.values) {
      for (const row of result[0].values) {
        quizzes.push({
          id: row[0],
          topic: row[1],
          title: row[2],
          description: row[3],
          difficulty: row[4],
          createdAt: row[5],
          questions: JSON.parse(row[6]),
          lastScore: row[7] !== null ? row[7] : undefined,
          timeLimitMinutes: row[8] !== null ? row[8] : undefined,
        });
      }
    }
    return quizzes;
  },

  findQuizByIdAndUserId(quizId, userId) {
    const db = getDatabase();
    const result = db.exec('SELECT * FROM quizzes WHERE id = ? AND user_id = ?', [quizId, userId]);
    return result[0]?.values?.length > 0;
  },

  createQuiz(userId, quiz) {
    const db = getDatabase();
    db.run(
      `
      INSERT INTO quizzes (id, user_id, topic, title, description, difficulty, created_at, questions, last_score, time_limit_minutes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        quiz.id,
        userId,
        quiz.topic,
        quiz.title,
        quiz.description || null,
        quiz.difficulty,
        quiz.createdAt,
        JSON.stringify(quiz.questions),
        quiz.lastScore !== undefined ? quiz.lastScore : null,
        quiz.timeLimitMinutes !== undefined ? quiz.timeLimitMinutes : null,
      ]
    );
    saveDatabase();
    return quiz;
  },

  updateScore(quizId, score) {
    const db = getDatabase();
    db.run('UPDATE quizzes SET last_score = ? WHERE id = ?', [score, quizId]);
    saveDatabase();
  },

  deleteQuiz(quizId, userId) {
    const db = getDatabase();
    db.run('DELETE FROM quizzes WHERE id = ? AND user_id = ?', [quizId, userId]);
    saveDatabase();
  },
};

export default quizRepository;
