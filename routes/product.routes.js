import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/product.controller.js";
import upload from '../middleware/multer.js';

const productRoute = Router();

productRoute.get('/', findAll);
productRoute.post('/', upload.single('image'), create);
productRoute.get('/:id', findOne);
productRoute.patch('/:id', upload.single('image'), update);
productRoute.delete('/:id', remove);

export default productRoute;