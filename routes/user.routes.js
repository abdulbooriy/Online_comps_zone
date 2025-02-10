import { Router } from "express";
import { findAll, login, register, sendOtp, verifyOtp, update, findOne, remove } from "../controllers/user.controller.js";

const userRoute = Router();

userRoute.post('/register', register);
userRoute.post('/sendOtp', sendOtp);
userRoute.post('/verifyOtp', verifyOtp);
userRoute.post('/login', login);
userRoute.get('/', findAll);
userRoute.patch('/:id', update);
userRoute.get('/:id', findOne);
userRoute.delete('/:id', remove);

export default userRoute;