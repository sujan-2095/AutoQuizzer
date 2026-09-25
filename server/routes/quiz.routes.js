import express from 'express';
import { quizController } from '../controllers/quizController.js';

const router = express.Router();

router.get('/user/:email', quizController.getQuizzes);
router.post('/', quizController.createQuiz);
router.patch('/:quizId/score', quizController.updateScore);
router.delete('/:quizId', quizController.deleteQuiz);

export default router;
