import { Request, Response } from 'express';
import Lynx from '../models/Lynx';

// Отримати інформацію про рись (включаючи litterSize)
export const getLynx = async (_: Request, res: Response): Promise<void> => {
    try {
        const lynx = await Lynx.findOne();
        if (!lynx) {
            res.status(404).json({ message: 'Рись не знайдена' });
            return;
        }
        res.json({ litterSize: lynx.litterSize });
        return;
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
        return;
    }
};
