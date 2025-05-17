import { Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "Рись"
interface IRabbit {
    name: string; // Ім'я рисі
    age: number; // Вік рисі у роках
    height: number; // Висота рисі в сантиметрах
    weight: number; // Вага рисі в кілограмах
    gender: 'male' | 'female'; // Стать рисі: 'male' - самець, 'female' - самка
    description?: string; // Опис рисі (необов'язкове поле)
    dateAdded: Date; // Дата додавання запису до бази даних
}

// Схема MongoDB для моделі "Рись"
const rabbitSchema = new Schema<IRabbit>({
    name: {
        type: String,
        required: true, // Поле є обов'язковим
    },
    age: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    height: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    weight: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    gender: {
        type: String,
        required: true, // Поле є обов'язковим
        enum: ['male', 'female'], // Допустимі значення: 'male' або 'female'
    },
    description: String, // Необов'язкове текстове поле
    dateAdded: {
        type: Date,
        default: Date.now, // Значення за замовчуванням - поточна дата і час
    },
});

// Створення моделі Mongoose на основі схеми
export const Rabbit = model<IRabbit>('Rabbit', rabbitSchema);
export type { IRabbit }; // Експортуємо інтерфейс для використання в інших файлах