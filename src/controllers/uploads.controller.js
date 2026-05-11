import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync.js";
import response from "../utils/response.js";
import ApiError from "../utils/ApiError.js";

// [POST] /api/v1/uploads
const uploadImage = catchAsync((req, res) => {
  const image = req.body.image;

  if (!image) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Lỗi Upload ảnh");
  }

  res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, "Upload ảnh thành công", {
      url: image,
    }),
  );
});

export default { uploadImage };