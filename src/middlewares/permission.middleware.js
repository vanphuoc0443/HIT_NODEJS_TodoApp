import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/index.js";

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userPermissions = req.permissions;

    //người dùng chưa đăng nhập, token sai
    if (!req.user || !userPermissions) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Vui lòng đăng nhập.");
    }

    //người dùng chưa có quyền
    if (!userPermissions.includes(requiredPermission)) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Bạn không có quyền!");
    }

    next();
  };
};

export default checkPermission;
