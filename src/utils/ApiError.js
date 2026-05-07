import { StatusCodes } from "http-status-codes";

class ApiError extends Error {
  constructor(statusCode = StatusCodes.BAD_REQUEST, message = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; //Phan biet loi tu code va loi tu he thong
    Error.captureStackTrace(this, this.constructor); //dọn dẹp stack trace
  }
}

export default ApiError;
