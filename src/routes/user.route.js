import { Router } from "express";
import { userController } from "../controllers/index.js";

const userRouter = Router();

userRouter.get("/", userController.getUsers);

userRouter.get("/:userId", userController.getUserById);

userRouter.post("/", userController.createUser);

userRouter.put("/:userId", userController.editUser);

userRouter.delete("/:userId", userController.delUser);

export default userRouter;
