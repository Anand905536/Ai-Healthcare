import express from 'express'
const router = express.Router();
import { register, login, dummy } from '../controllers/auth.controller.js'
import authMiddleware from '../middleware/auth.middleware.js';
import { uploadProfilePicture } from '../controllers/user.controller.js'
import upload from "../middleware/upload.middleware.js";


router.get('/me', authMiddleware, dummy)
router.post('/login', login)
router.post('/register', register)
router.post('/profile-picture', authMiddleware, upload.single("profilePicture"), uploadProfilePicture)


export default router