import { StatusCodes } from "http-status-codes";
import todoModel from "../models/todo.model.js";
import catchAsync from "../utils/catchAsync.js";
import response from "../utils/response.js";

//[GET] /todo
const getTodos = catchAsync(async (req, res) => {
  const todos = await todoModel.find({
    userId: req.user.id,
  });

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Lấy danh sách todo thành công.", todos));
});

//[GET] /todo/:id
const getTodoById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const todo = await todoModel.findOne({
    _id: id,
    userId: req.user.id,
  });

  if (!todo) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        response(
          StatusCodes.NOT_FOUND,
          "Todo không tồn tại hoặc không có quyền.",
        ),
      );
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Lấy todo thành công.", todo));
});

//[POST] /todo
const createTodo = catchAsync(async (req, res) => {
  const { title, description } = req.body;

  const todo = await todoModel.create({
    title,
    description,
    userId: req.user.id,
  });

  return res
    .status(StatusCodes.CREATED)
    .json(response(StatusCodes.CREATED, "Tạo todo thành công.", todo));
});

//[PUT] /todo/:id
const updateTodo = catchAsync(async (req, res) => {
  const { id } = req.params;

  const todo = await todoModel.findOneAndUpdate(
    {
      _id: id,
      userId: req.user.id,
    },
    req.body,
    { new: true },
  );

  if (!todo) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        response(
          StatusCodes.NOT_FOUND,
          "Todo không tồn tại hoặc không có quyền cập nhật.",
        ),
      );
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Cập nhật todo thành công.", todo));
});

//[DELETE] /todo/:id
const deleteTodo = catchAsync(async (req, res) => {
  const { id } = req.params;

  const todo = await todoModel.findOneAndDelete({
    _id: id,
    userId: req.user.id,
  });

  if (!todo) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        response(
          StatusCodes.NOT_FOUND,
          "Todo không tồn tại hoặc không có quyền xoá.",
        ),
      );
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Xoá todo thành công."));
});

export default {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
