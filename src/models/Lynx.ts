import mongoose, { Schema, Document } from 'mongoose';

export interface ILynx extends Document {
    name: string;
    age: number;
    gender: string;
    weight: number;
    description?: string;
    litterSize: number; // Кількість малят у виводку рисі
}

const LynxSchema: Schema = new Schema({
    name: { type: String, required: true, description: 'Імʼя рисі' },
    age: { type: Number, required: true, description: 'Вік рисі' },
    gender: { type: String, required: true, description: 'Стать рисі' },
    weight: { type: Number, required: true, description: 'Вага рисі' },
    description: { type: String, description: 'Опис рисі' },
    litterSize: { type: Number, required: true, description: 'Кількість малят у виводку рисі' },
});

export default mongoose.model<ILynx>('Lynx', LynxSchema);
