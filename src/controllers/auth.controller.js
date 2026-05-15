import { StatusCodes } from "http-status-codes";
import { tokenModel, userModel } from "../models/index.js";
import bcrypt from "bcrypt";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import jwt from "../utils/jwt.js";
import env from "../configs/env.config.js";
import response from "../utils/response.js";
import hashToken from "../utils/token.js";

// [POST] /auth/login
const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });
  if (!user) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Username hoặc mật khẩu không hợp lệ.",
    );
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Username hoặc mật khẩu không hợp lệ.",
    );
  }

  if (user.status !== "active") {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Tài khoản của bạn đã bị khóa.",
    );
  }

  // Tạo token
  const accessToken = jwt.generateAccessToken(user._id);
  const refreshToken = jwt.generateRefreshToken(user._id);
  const refreshTokenHash = hashToken(refreshToken);

  //Xóa token cũ trước khi tạo mới nếu có
  await tokenModel.deleteOne({ userId: user.id });

  // Lưu token vào db
  await tokenModel.create({
    userId: user.id,
    refreshTokenHash,
    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Thiết lập Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Chỉ server mới có thể truy cập token này
    secure: env.server.nodeEnv === "production", // Chỉ gửi cookie qua kết nối HTTPS trong production
    sameSite: env.server.nodeEnv === "production" ? "none" : "lax", // None khi 2 domain khác nhau, lax khi cùng domain
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Đăng nhập thành công.", { accessToken }));
});

// [POST] /auth/logout
const logout = catchAsync(async (req, res) => {
  // Xóa cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.server.nodeEnv === "production",
    sameSite: env.server.nodeEnv === "production" ? "none" : "lax",
  });

  // Xóa token trong database
  await tokenModel.deleteOne({ userId: req.user._id });

  return res
    .status(StatusCodes.OK)
    .json(response(StatusCodes.OK, "Đăng xuất thành công.", {}));
});


// [POST] /auth/refresh-token
const refreshToken = catchAsync(async (req, res) => {
  const tokenValue = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!tokenValue) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Không tìm thấy refresh token.",
    );
  }

  const tokenDoc = await tokenModel.findOne({
    refreshToken: tokenValue,
  });

  if (!tokenDoc) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Token hết hạn hoặc không tồn tại.",
    );
  }

  let payload;

  try {
    payload = jwt.verifyRefreshToken(tokenValue);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      await tokenModel.deleteOne({
        refreshToken: tokenValue,
      });

      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      );
    }

    throw new ApiError(StatusCodes.UNAUTHORIZED, "Token không hợp lệ.");
  }

  if (tokenDoc.userId.toString() !== payload.id) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Token không khớp với người dùng.",
    );
  }

  const accessToken = jwt.generateAccessToken(tokenDoc.userId);

  return res
    .status(StatusCodes.OK)
    .json(
      response(StatusCodes.OK, "Refresh token thành công.", { accessToken }),
    );
});

// [GET] /auth/me
const getMe = catchAsync(async (req, res) => {
  const user = req.user;

  return res
    .status(StatusCodes.OK)
    .json(
      response(StatusCodes.OK, "Lấy thông tin người dùng thành công.", user),
    );
});

export default {
  getMe,
  login,
  logout,
  refreshToken,
};
