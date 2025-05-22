import { Router } from 'express';
import { getLynx } from '../controllers/lynxController';

const router = Router();

// GET /api/lynx - отримати інформацію про рись (включаючи litterSize)
router.get('/', (req, res) => {
    void getLynx(req, res);
});

export default router;
