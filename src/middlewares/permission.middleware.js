import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/index.js";

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userPermissions = req.permissions;

    if (!userPermissions.includes(requiredPermission)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Bạn không có quyền!");
    }
   
    next();
  };
};

export default checkPermission;
