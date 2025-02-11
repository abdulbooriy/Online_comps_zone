import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/product.controller.js";
import upload from '../middleware/multer.js';
import verifyToken from '../middleware/verifyToken.js';

const productRoute = Router();

productRoute.get('/', verifyToken, findAll);
productRoute.post('/', verifyToken, upload.single('image'), create);
productRoute.get('/:id', verifyToken, findOne);
productRoute.patch('/:id', verifyToken, upload.single('image'), update);
productRoute.delete('/:id', verifyToken, remove);

export default productRoute;