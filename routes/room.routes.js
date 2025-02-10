import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/room.controller.js";

const roomRoute = Router();

roomRoute.get('/', findAll);
roomRoute.post('/', create);
roomRoute.get('/:id', findOne);
roomRoute.patch('/:id', update);
roomRoute.delete('/:id', remove);

export default roomRoute;