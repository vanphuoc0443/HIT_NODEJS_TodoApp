import { Router } from "express";
import { userController } from "../controllers/index.js";
import validate from "../middlewares/validate.middleware.js";
import { userValidation } from "../validation/index.js";
import auth from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
import loadPermissions from "../middlewares/loadPermissions.middleware.js";
import { PERMISSIONS } from "../constants/permission.constant.js";

const userRouter = Router();

userRouter.post("/", validate(userValidation.createUser), userController.createUser);

userRouter.get("/", auth, loadPermissions, checkPermission(PERMISSIONS.GET_USER), userController.getUsers);

userRouter.get("/:userId", auth, loadPermissions, checkPermission(PERMISSIONS.GET_USER), validate(userValidation.getUserById), userController.getUserById);

userRouter.put("/:userId", auth, loadPermissions, checkPermission(PERMISSIONS.UPDATE_USER), validate(userValidation.updateUser), userController.editUser);

userRouter.delete("/:userId", auth, loadPermissions, checkPermission(PERMISSIONS.DELETE_USER), validate(userValidation.deleteUser), userController.delUser);

export default userRouter;
