import { Router } from "express";
import roleController from "../controllers/role.controller.js";
import validate from "../middlewares/validate.middleware.js";
import roleValidation from "../validation/role.validation.js";
import auth from "../middlewares/auth.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
import loadPermissions from "../middlewares/loadPermissions.middleware.js";
import { PERMISSIONS } from "../constants/permission.constant.js";

const roleRouter = Router();

roleRouter.get("/", auth, loadPermissions, checkPermission(PERMISSIONS.GET_ROLE), roleController.getRoles);

roleRouter.get("/:roleId", auth, loadPermissions, checkPermission(PERMISSIONS.GET_ROLE), validate(roleValidation.getRoleById), roleController.getRoleById);

roleRouter.post("/", auth, loadPermissions, checkPermission(PERMISSIONS.CREATE_ROLE), validate(roleValidation.createRole), roleController.createRole);

roleRouter.put("/:roleId", auth, loadPermissions, checkPermission(PERMISSIONS.UPDATE_ROLE), validate(roleValidation.updateRole), roleController.editRole);

roleRouter.delete("/:roleId", auth, loadPermissions, checkPermission(PERMISSIONS.DELETE_ROLE), validate(roleValidation.deleteRole), roleController.delRole);

export default roleRouter;
