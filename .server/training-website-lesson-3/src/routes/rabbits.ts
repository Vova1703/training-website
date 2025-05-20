import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { RabbitRepository } from '../repositories/RabbitRepository';

// Створюємо новий обробник HTTP-запитів Express
const router = Router();
// Отримуємо екземпляр репозиторію зайців з контейнера інверсії залежностей
const rabbitRepository = container.get(RabbitRepository);

// Обробка HTTP-запиту GET / - отримання всіх записів зайців
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи зайців з бази даних через репозиторій
        const rabbits = await rabbitRepository.findAll();
        res.json(rabbits);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту GET /:id - отримання запису одного зайця за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук зайця за ідентифікатором
        const rabbit = await rabbitRepository.findById(req.params.id);
        if (rabbit) {
            res.json(rabbit);
        } else {
            // Якщо заєць не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис зайця не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту POST / - створення нового запису зайця
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис зайця з даних запиту
        const newRabbit = await rabbitRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеного зайця
        res.status(201).json(newRabbit);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PUT /:id - повне оновлення запису зайця
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        // Перевірка наявності всіх обов'язкових полів для PUT запиту
        const requiredFields = ['name', 'age', 'height', 'weight', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        // Якщо є відсутні поля, повертаємо помилку 400 Bad Request
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }

        // Оновлюємо зайця з вказаним ID
        const rabbit = await rabbitRepository.update(req.params.id, req.body);
        if (rabbit) {
            return res.json(rabbit);
        } else {
            // Якщо заєць не знайдений, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис зайця не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PATCH /:id - часткове оновлення запису зайця
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису зайця - передаються лише ті поля, які потрібно змінити
        const rabbit = await rabbitRepository.patch(req.params.id, req.body);
        if (rabbit) {
            res.json(rabbit);
        } else {
            // Якщо заєць не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис зайця не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту DELETE /:id - видалення запису зайця
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про зайця за ID
        const rabbit = await rabbitRepository.delete(req.params.id);
        if (rabbit) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про зайця видалено' });
        } else {
            // Якщо заєць не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про зайця не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
