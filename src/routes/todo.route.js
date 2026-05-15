import { Router } from "express";
import { todoController } from "../controllers/index.js";
import { todoValidation } from "../validation/index.js";
import validate from "../middlewares/validate.middleware.js";
import { PERMISSIONS } from "../constants/permission.constant.js";
import loadPermissions from "../middlewares/loadPermissions.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
const todoRouter = Router();
todoRouter.get(
  "/",
  loadPermissions,
  checkPermission(PERMISSIONS.GET_TODO),
  validate(todoValidation.getTodos), 
  todoController.getTodos
);

todoRouter.get(
  "/:id",
  loadPermissions,
  checkPermission(PERMISSIONS.GET_TODO),
  validate(todoValidation.getTodoById),
  todoController.getTodoById,
);

todoRouter.post(
  "/",
  loadPermissions,
  checkPermission(PERMISSIONS.CREATE_TODO),
  validate(todoValidation.createTodo),
  todoController.createTodo,
);

todoRouter.put(
  "/:id",
  loadPermissions,
  checkPermission(PERMISSIONS.UPDATE_TODO),
  validate(todoValidation.updateTodo),
  todoController.updateTodo,
);

todoRouter.delete(
  "/:id",
  loadPermissions,
  checkPermission(PERMISSIONS.DELETE_TODO),
  validate(todoValidation.deleteTodo),
  todoController.deleteTodo,
);

export default todoRouter;
