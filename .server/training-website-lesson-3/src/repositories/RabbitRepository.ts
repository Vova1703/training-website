import { injectable } from 'inversify';
// Перевірте, як саме називається файл у папці models:
// Якщо файл називається Lynx.ts:
import { Lynx, ILynx } from '../models/Lynx';
// Якщо файл називається lynx.ts, залиште так:
/// import { Lynx, ILynx } from '../models/lynx';

@injectable()
export class LynxRepository {
    public async findAll(): Promise<ILynx[]> {
        return Lynx.find();
    }
    public async findById(id: string): Promise<ILynx | null> {
        return Lynx.findById(id);
    }
    public async create(lynxData: ILynx): Promise<ILynx> {
        const lynx = new Lynx(lynxData);
        return lynx.save();
    }
    public async delete(id: string): Promise<boolean> {
        const result = await Lynx.findByIdAndDelete(id);
        return result !== null;
    }
    public async update(id: string, lynxData: ILynx): Promise<ILynx | null> {
        return Lynx.findByIdAndUpdate(id, lynxData, { new: true });
    }
    public async patch(id: string, lynxData: Partial<ILynx>): Promise<ILynx | null> {
        return Lynx.findByIdAndUpdate(id, { $set: lynxData }, { new: true });
    }
}