import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/protected', authMiddleware, (req, res) => {
    res.json({ message: "This is a protected route.", user: req.user });
});

export default router;