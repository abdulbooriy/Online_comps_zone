import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/room.controller.js";
import verifyToken from '../middleware/verifyToken.js';
import upload from "../middleware/multer.js";

const roomRoute = Router();

roomRoute.get('/', verifyToken, findAll);
roomRoute.post('/', verifyToken, upload.single('image'), create);
roomRoute.get('/:id', verifyToken, findOne);
roomRoute.patch('/:id', verifyToken, upload.single('image'), update);
roomRoute.delete('/:id', verifyToken, remove);

export default roomRoute;