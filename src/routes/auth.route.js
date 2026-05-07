import { Router } from "express";
import { authController } from "../controllers/index.js";
import auth from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.get("/me", auth, authController.getMe);

authRouter.post("/login", authController.login);

authRouter.post("/logout", auth, authController.logout);

authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;
