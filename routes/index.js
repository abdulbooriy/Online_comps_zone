import { Router } from "express";
import userRoute from "./user.routes.js";
import productRoute from "./product.routes.js";
import roomRoute from "./room.routes.js";
import orderRoute from "./order.routes.js";
import orderCompRoute from "./orderComp.routes.js";

const mainRoute = Router();

mainRoute.use("/users", userRoute);
mainRoute.use("/products", productRoute);
mainRoute.use('/rooms', roomRoute);
mainRoute.use('/orders', orderRoute);
mainRoute.use('/orderComps', orderCompRoute);

export default mainRoute;