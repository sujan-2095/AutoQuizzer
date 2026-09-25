import express from 'express';
import { geminiController } from '../controllers/geminiController.js';

const router = express.Router();

router.post('/generate', geminiController.generateQuiz);

export default router;
