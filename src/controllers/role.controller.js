import { StatusCodes } from "http-status-codes";
import { roleModel } from "../models/index.js";
import catchAsync from "../utils/catchAsync.js";
import response from "../utils/response.js";
import ApiError from "../utils/ApiError.js";

// [GET] /api/v1/roles
const getRoles = catchAsync(async (req, res) => {
  const roles = await roleModel.find().populate("permissions", "name");

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Lấy danh sách role thành công.", roles));
});

// [GET] /api/v1/roles/:roleId
const getRoleById = catchAsync(async (req, res) => {
  const { roleId } = req.params;

  const role = await roleModel.findById(roleId).populate("permissions", "name");

  if (!role) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Role không tồn tại.");
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Lấy role thành công.", role));
});

// [POST] /api/v1/roles
const createRole = catchAsync(async (req, res) => {
  const { name, permissions } = req.body;

  const existRole = await roleModel.findOne({ name });

  if (existRole) {
    throw new ApiError(StatusCodes.CONFLICT, "Role đã tồn tại.");
  }

  const newRole = await roleModel.create({ name, permissions });

  return res
    .status(StatusCodes.CREATED)
    .json(response(StatusCodes.CREATED, "Tạo role thành công.", newRole));
});

// [PUT] /api/v1/roles/:roleId
const editRole = catchAsync(async (req, res) => {
  const { roleId } = req.params;

  const updatedRole = await roleModel
    .findByIdAndUpdate(roleId, req.body, { new: true })
    .populate("permissions", "name");

  if (!updatedRole) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Role không tồn tại.");
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Sửa role thành công.", updatedRole));
});

// [DELETE] /api/v1/roles/:roleId
const delRole = catchAsync(async (req, res) => {
  const { roleId } = req.params;

  const deletedRole = await roleModel.findByIdAndDelete(roleId);

  if (!deletedRole) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Role không tồn tại.");
  }

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Xóa role thành công.", deletedRole));
});

export default {
  getRoles,
  getRoleById,
  createRole,
  editRole,
  delRole,
};
