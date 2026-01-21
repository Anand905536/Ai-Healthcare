import express from 'express';
const router = express.Router();

import authMiddleware from '../middleware/auth.middleware.js';
import upload  from '../middleware/upload.middleware.js';
import {uploadReport,getMyReports,downloadReport,runAIOnReport} from '../controllers/report.controller.js';



router.post('/upload', authMiddleware, upload.single('report'), uploadReport);
router.get('/my',authMiddleware,getMyReports)
router.get('/:id/download',authMiddleware,downloadReport)
router.post('/run-ai',authMiddleware,runAIOnReport)
export default router;
