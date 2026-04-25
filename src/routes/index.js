import { Router } from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";
import todoRouter from "./todo.route.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/users", userRouter);

router.use("/auth", authRouter);

router.use("/todos", auth, todoRouter);

export default router;
