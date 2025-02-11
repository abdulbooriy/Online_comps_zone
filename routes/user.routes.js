import { Router } from "express";
import { findAll, login, register, sendOtp, verifyOtp, update, findOne, remove, create } from "../controllers/user.controller.js";
import verifytoken from '../middleware/verifyToken.js';
import checkRole from '../middleware/rolePolice.js';
import selfpolice from '../middleware/selfPolice.js';

const userRoute = Router();

userRoute.post('/sendOtp', sendOtp);
userRoute.post('/verifyOtp', verifyOtp);
userRoute.post('/register', register);
userRoute.post('/login', login);
userRoute.get('/', verifytoken, checkRole(["admin", 'user']), findAll);
userRoute.post('/', verifytoken, checkRole(['admin', 'user']), create);
userRoute.patch('/:id', verifytoken, selfpolice(['admin', 'user']), update);
userRoute.get('/:id', verifytoken, findOne);
userRoute.delete('/:id', verifytoken, remove);

export default userRoute;