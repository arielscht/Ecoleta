import { Request, Response, NextFunction, request } from 'express';
import knex from '../database/connection';

class PointsController {
    async create(req: Request, res: Response, next: NextFunction) {
        const { 
            name, 
            email, 
            whatsapp, 
            city, 
            uf, 
            latitude, 
            longitude,
            items
        } = req.body;
    
        const trx = await knex.transaction();
    
        const point = {
            image: req.file.filename,
            name, 
            email, 
            whatsapp, 
            city, 
            uf, 
            latitude: Number(latitude), 
            longitude: Number(longitude)
        }

        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0]
    
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: Number) => {
            return {
                item_id,
                point_id
            }
        })
    
        await trx('point_items').insert(pointItems);
       
        await trx.commit();

        return res.json({ 
            id: point_id,
            ...point
        });
    }

    async show(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if(!point) {
            return res.status(400).json({message: 'point not found'});
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return res.json({
            point: {
                ...point,
                image: `http://192.168.1.113:3333/uploads/${point.image}`
            },
            items
        });
    }

    async index(req: Request, res: Response, next: NextFunction) {
        const { city, uf, items } = req.query;
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image: `http://192.168.1.113:3333/uploads/${point.image}`
            }
        }); 

        return res.json(serializedPoints);
    }
}

export default PointsController;