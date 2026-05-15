import { StatusCodes } from "http-status-codes";
import todoModel from "../models/todo.model.js";
import catchAsync from "../utils/catchAsync.js";
import response from "../utils/response.js";
import createSlug from "../utils/slug.js";

// [GET] /todo
const getTodos = catchAsync(async (req, res) => {
  const {
    search = "",
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    userId: req.user.id,
  };

  const searchSlug = createSlug(search);
  if (searchSlug) {
    filter.slug = {
      $regex: searchSlug,
      $options: "i",
    };
  }

  if (status) {
    filter.status = status;
  }

  const sort = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [todos, total] = await Promise.all([
    todoModel.find(filter).sort(sort).skip(skip).limit(limit),
    todoModel.countDocuments(filter),
  ]);

  return res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, "Lấy danh sách todo thành công.", {
      items: todos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }),
  );
});

// [GET] /todo/:id
const getTodoById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const todo = await todoModel.findOne({
    _id: id,
    userId: req.user.id,
  });

  if (!todo) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(response(StatusCodes.NOT_FOUND, "Todo không tồn tại hoặc không có quyền."));
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Lấy todo thành công.", todo));
});

// [POST] /todo
const createTodo = catchAsync(async (req, res) => {
  const { title, description, status } = req.body;

  const todo = await todoModel.create({
    title,
    slug: createSlug(title),
    description,
    status,
    userId: req.user.id,
  });

  return res
    .status(StatusCodes.CREATED)
    .json(response(StatusCodes.CREATED, "Tạo todo thành công.", todo));
});

// [PUT] /todo/:id
const updateTodo = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (req.body.title) {
    req.body.slug = createSlug(req.body.title);
  }

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
      .json(response(StatusCodes.NOT_FOUND, "Todo không tồn tại hoặc không có quyền cập nhật."));
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Cập nhật todo thành công.", todo));
});

// [DELETE] /todo/:id
const deleteTodo = catchAsync(async (req, res) => {
  const { id } = req.params;

  const todo = await todoModel.findOneAndDelete({
    _id: id,
    userId: req.user.id,
  });

  if (!todo) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(response(StatusCodes.NOT_FOUND, "Todo không tồn tại hoặc không có quyền xóa."));
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Xóa todo thành công."));
});

export default {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
