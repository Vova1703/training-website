import { Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "Рись"
interface ILynx {
    name: string;
    age: number;
    height: number;
    weight: number;
    gender: 'male' | 'female';
    description?: string;
    dateAdded: Date;
}

const lynxSchema = new Schema<ILynx>({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['male', 'female'] },
    description: String,
    dateAdded: { type: Date, default: Date.now },
});

export const Lynx = model<ILynx>('Lynx', lynxSchema);
export type { ILynx };
