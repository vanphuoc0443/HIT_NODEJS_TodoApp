import { StatusCodes } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
  console.log("Lỗi đã được xử lý bởi middleware:", err);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Đã xảy ra lỗi không xác định.";
  res.status(statusCode).json({
    statusCode,
    message,
  });
};

export default errorHandler;
