import { Router } from "express";
import { authController } from "../controllers/index.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { authValidation } from "../validation/index.js";

const authRouter = Router();

authRouter.get("/me", auth, authController.getMe);

authRouter.post("/login", validate(authValidation.login), authController.login);

authRouter.post("/logout", auth, authController.logout);

authRouter.post("/refresh-token", validate(authValidation.refreshToken), authController.refreshToken);

export default authRouter;
