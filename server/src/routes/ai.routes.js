import express from 'express';
import { summerizeReport } from '../controllers/ai.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router=express.Router();

router.post('/summarize',authMiddleware,summerizeReport)
export default router