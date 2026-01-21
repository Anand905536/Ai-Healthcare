import express from 'express'
const router = express.Router();
import { register, login, dummy } from '../controllers/auth.controller.js'
import authMiddleware from '../middleware/auth.middleware.js';
import { uploadProfilePicture, updateProfile, forgetPassword, resetPassword } from '../controllers/user.controller.js'
import upload from "../middleware/upload.middleware.js";


router.get('/me', authMiddleware, dummy)
router.post('/login', login)
router.post('/register', register)
router.post('/profile-picture', authMiddleware, upload.single("profilePicture"), uploadProfilePicture)
router.put('/update-profile-detail', authMiddleware, updateProfile)
router.post('/forget-password', forgetPassword)
router.post('/reset-password/:token', resetPassword)



export default router