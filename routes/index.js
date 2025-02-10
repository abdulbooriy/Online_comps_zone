import { Router } from "express";
import userRoute from "./user.routes.js";
import productRoute from "./product.routes.js";
import roomRoute from "./room.routes.js";

const mainRoute = Router();

mainRoute.use("/users", userRoute);
mainRoute.use("/products", productRoute);
mainRoute.use('/rooms', roomRoute);

export default mainRoute;