import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync.js";
import response from "../utils/response.js";

// [GET] /api/v1/user
const uploadImage = catchAsync((req, res) => {
  const avatar = req.body.avatar;

  if (!avatar) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Lỗi Upload ảnh");
  }

  res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, "Upload ảnh thành công", {
      url: avatar,
    }),
  );
});

export default { uploadImage };