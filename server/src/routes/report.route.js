import express from 'express';
const router = express.Router();

import authMiddleware from '../middleware/auth.middleware.js';
import upload  from '../middleware/upload.middleware.js';
import {uploadReport,getMyReports,downloadReport} from '../controllers/report.controller.js';

router.post('/upload', authMiddleware, upload.single('report'), uploadReport);
router.get('/my',authMiddleware,getMyReports)
router.get('/:id/download',authMiddleware,downloadReport)

export default router;
