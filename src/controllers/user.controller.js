import { StatusCodes } from "http-status-codes";
import { userModel } from "../models/index.js";
import bcrypt from "bcrypt";

//[GET] /api/v1/user
const getUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");

    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "Lấy danh sách người dùng thành công.",
      data: users,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || "Lỗi server",
    });
  }
};

//[GET] /api/v1/user/:userId
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      throw new Error("User không tồn tại");
    }

    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "Lấy user thành công.",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lỗi server",
    });
  }
};

//[POST] /api/v1/user
const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("Thiếu username hoặc password");
    }

    const existUser = await userModel.findOne({ username });
    if (existUser) {
      throw new Error("User đã tồn tại");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      password: hashPassword,
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      message: "Tạo người dùng thành công.",
      data: userObj,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lỗi server",
    });
  }
};

//[PUT] /api/v1/user/:userId
const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, password } = req.body;

    let updateData = {};

    if (username) updateData.username = username;

    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      updateData.password = hashPassword;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password");

    if (!updatedUser) {
      throw new Error("User không tồn tại.");
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Sửa người dùng thành công.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lỗi server",
    });
  }
};

//[DELETE] /api/v1/user/:userId
const delUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await userModel
      .findByIdAndDelete(userId)
      .select("-password");

    if (!deletedUser) {
      throw new Error("User không tồn tại.");
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Xóa người dùng thành công.",
      data: deletedUser,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lỗi server",
    });
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  editUser,
  delUser,
};
