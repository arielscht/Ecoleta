import express from 'express';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';

import multerConfig from './config/multer';

import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';

const upload = multer(multerConfig);
const router = express.Router();

const pointsController = new PointsController();
const itemsController = new ItemsController();

router.get('/items', itemsController.index);

router.post('/points', 
upload.single('image'),
celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2),
        items: Joi.string().required()
    })
}), 
pointsController.create
);
router.get('/points', pointsController.index);
router.get('/points/:id', pointsController.show);

export default router;