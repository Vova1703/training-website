import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { LynxRepository } from '../repositories/RabbitRepository';

const router: import('express').Router = Router();
// Отримуємо екземпляр репозиторію рисей з контейнера інверсії залежностей
const lynxRepository: LynxRepository = container.get<LynxRepository>(LynxRepository);

// Обробка HTTP-запиту GET / - отримання всіх записів рисей
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи рисей з бази даних через репозиторій
        const lynxes = await lynxRepository.findAll();
        res.json(lynxes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту GET /:id - отримання запису однієї рисі за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        const lynx = await lynxRepository.findById(req.params.id);
        if (lynx) {
            res.json(lynx);
        } else {
            res.status(404).json({ message: 'Запис рисі не знайдено' });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту POST / - створення нового запису рисі
router.post('/', (async (req: Request, res: Response) => {
    try {
        const newLynx = await lynxRepository.create(req.body);
        res.status(201).json(newLynx);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PUT /:id - повне оновлення запису рисі
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        const requiredFields = ['name', 'age', 'height', 'weight', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }
        const lynx = await lynxRepository.update(req.params.id, req.body);
        if (lynx) {
            return res.json(lynx);
        } else {
            return res.status(404).json({ message: 'Запис рисі не знайдено' });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PATCH /:id - часткове оновлення запису рисі
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        const lynx = await lynxRepository.patch(req.params.id, req.body);
        if (lynx) {
            res.json(lynx);
        } else {
            res.status(404).json({ message: 'Запис рисі не знайдено' });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту DELETE /:id - видалення запису рисі
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        const lynx = await lynxRepository.delete(req.params.id);
        if (lynx) {
            res.json({ message: 'Запис про рись видалено' });
        } else {
            res.status(404).json({ message: 'Запис про рись не знайдено' });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
