import { injectable } from 'inversify';
import { Rabbit, IRabbit } from '../models/rabbit';

// Клас-репозиторій для роботи з зайцями
// Анотація injectable дозволяє впровадити цей репозиторій через IoC контейнер
@injectable()
export class RabbitRepository {
    // Метод для отримання всіх зайців з бази даних
    public async findAll(): Promise<IRabbit[]> {
        return Rabbit.find();
    }

    // Метод для пошуку зайця за унікальним ідентифікатором
    public async findById(id: string): Promise<IRabbit | null> {
        return Rabbit.findById(id);
    }

    // Метод для створення нового зайця в базі даних
    public async create(rabbitData: IRabbit): Promise<IRabbit> {
        const rabbit = new Rabbit(rabbitData);
        return rabbit.save();
    }

    // Метод для видалення зайця за ідентифікатором
    public async delete(id: string): Promise<boolean> {
        const result = await Rabbit.findByIdAndDelete(id);
        return result !== null;
    }

    // Метод для повного оновлення даних про зайця (заміна всіх полів)
    public async update(id: string, rabbitData: IRabbit): Promise<IRabbit | null> {
        return Rabbit.findByIdAndUpdate(id, rabbitData, { new: true });
    }

    // Метод для часткового оновлення даних про зайця (оновлення лише вказаних полів)
    public async patch(id: string, rabbitData: Partial<IRabbit>): Promise<IRabbit | null> {
        return Rabbit.findByIdAndUpdate(id, { $set: rabbitData }, { new: true });
    }
}
