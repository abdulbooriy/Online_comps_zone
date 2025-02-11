import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/order.controller.js";
import verifyToken from '../middleware/verifyToken.js';

const orderRoute = Router();

orderRoute.get('/', verifyToken, findAll);
orderRoute.post('/', verifyToken, create);
orderRoute.get('/:id', verifyToken, findOne);
orderRoute.patch('/:id', verifyToken, update);
orderRoute.delete('/:id', verifyToken, remove);

export default orderRoute;