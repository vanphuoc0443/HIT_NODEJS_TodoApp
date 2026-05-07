import { StatusCodes } from "http-status-codes";
import env from "../configs/env.config.js";

const errorHandler = (err, req, res, next) => {
  console.log("Lỗi đã được xử lý bởi middleware:", err);
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Đã xảy ra lỗi không xác định.";

  //Lỗi do hệ thống
  if (!err.isOperational) {
    console.error("Lỗi hệ thống.", err)
    message = "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.";
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    if (env.server.nodeEnv === "production") {
      message = "Lỗi máy chủ nội bộ.";
    }
  }

  //Lỗi sai định dạng ID
  if (err.name === "CastError") {
    err.isOperational = true;
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.message;
  }

  if (err.name === "ValidationError") {
    err.isOperational = true;
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.message;
  }

  //Lỗi do trùng dữ liệu
  if (err.code === 11000) {
    err.isOperational = true;
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.message;
  }

  res.status(statusCode).json({
    statusCode,
    message,
  });
};

export default errorHandler;
