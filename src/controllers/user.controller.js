import { StatusCodes } from "http-status-codes";
import { userModel, roleModel } from "../models/index.js";
import bcrypt from "bcrypt";
import catchAsync from "../utils/catchAsync.js";
import response from "../utils/response.js";
import ApiError from "../utils/ApiError.js";

// [GET] /api/v1/user
const getUsers = catchAsync(async (req, res) => {
  const users = await userModel.find().select("-password");

  return res
    .status(StatusCodes.OK)
    .json(
      response(StatusCodes.OK, "Lấy danh sách người dùng thành công.", users),
    );
});

// [GET] /api/v1/user/:userId
const getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(response(StatusCodes.NOT_FOUND, "User không tồn tại."));
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Lấy user thành công.", user));
});

// [POST] /api/v1/user
const createUser = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const existUser = await userModel.findOne({ username });

  if (existUser) {
    throw new ApiError(StatusCodes.CONFLICT, "User đã tồn tại.");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // Lấy role mặc định là "user"
  const defaultRole = await roleModel.findOne({ name: "user" });

  const newUser = await userModel.create({
    username,
    password: hashPassword,
    role: defaultRole ? defaultRole._id : null, // Gán role mặc định
  });

  const userObj = newUser.toObject();
  delete userObj.password;

  return res
    .status(StatusCodes.CREATED)
    .json(response(StatusCodes.CREATED, "Tạo người dùng thành công.", userObj));
});

// [PUT] /api/v1/user/:userId
const editUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { username, password, role } = req.body;

  let updateData = {};

  if (username) updateData.username = username;
  if (role) updateData.role = role; // Thêm dòng này để Admin update role

  if (password) {
    const hashPassword = await bcrypt.hash(password, 10);
    updateData.password = hashPassword;
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(userId, updateData, { new: true })
    .select("-password");

  if (!updatedUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(response(StatusCodes.NOT_FOUND, "User không tồn tại."));
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Sửa người dùng thành công.", updatedUser));
});

// [DELETE] /api/v1/user/:userId
const delUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const deletedUser = await userModel
    .findByIdAndDelete(userId)
    .select("-password");

  if (!deletedUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(response(StatusCodes.NOT_FOUND, "User không tồn tại."));
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Xóa người dùng thành công.", deletedUser));
});

export default {
  getUsers,
  getUserById,
  createUser,
  editUser,
  delUser,
};
