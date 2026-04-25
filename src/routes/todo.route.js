import { Router } from "express";
import { todoController } from "../controllers/index.js";
import { todoValidation } from "../validation/index.js";
import validate from "../middlewares/validate.middleware.js";

const todoRouter = Router();

todoRouter.get("/", todoController.getTodos);

todoRouter.get(
  "/:id",
  validate(todoValidation.getTodoById),
  todoController.getTodoById,
);

todoRouter.post(
  "/",
  validate(todoValidation.createTodo),
  todoController.createTodo,
);

todoRouter.put(
  "/:id",
  validate(todoValidation.updateTodo),
  todoController.updateTodo,
);

todoRouter.delete(
  "/:id",
  validate(todoValidation.deleteTodo),
  todoController.deleteTodo,
);

export default todoRouter;
