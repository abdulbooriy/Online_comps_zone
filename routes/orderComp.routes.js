import { Router } from "express";
import { findAll, create } from "../controllers/orderComp.controller.js";
import verifyToken from '../middleware/verifyToken.js';

const orderCompRoute = Router();
orderCompRoute.use('/', verifyToken, findAll);  
orderCompRoute.use('/', verifyToken, create);

export default orderCompRoute;