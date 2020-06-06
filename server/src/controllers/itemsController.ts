import { Request, Response, NextFunction } from 'express';
import knex from '../database/connection';

class ItemsController {
    async index(req: Request, res: Response, next: NextFunction) {
        const items = await knex('items').select('*');
    
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.1.113:3333/uploads/${item.image}`
            }
        }); 

        return res.json(serializedItems);
    }
}

export default ItemsController;