import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import jwt from "../utils/jwt.js";
import catchAsync from "../utils/catchAsync.js";
import { userModel } from "../models/index.js";

const auth = catchAsync(async (req, res, next) => {
  const token = jwt.extractToken(req);

  if (!token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Bạn chưa đăng nhập.");
  }

  let payload;

  try {
    payload = jwt.verifyAccessToken(token);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      );
    }

    throw new ApiError(StatusCodes.UNAUTHORIZED, "Token không hợp lệ.");
  }

  const user = await userModel.findById(payload.id).select("-password");

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Người dùng không tồn tại.");
  }

  req.user = user;
  next();
});

export default auth;
