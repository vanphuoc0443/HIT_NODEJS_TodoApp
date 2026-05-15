import cloudinary from "../configs/cloudinary.config.js";
import multer from "multer";

const storage = multer.memoryStorage();

export const uploadMemory = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // Giới hạn 30MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Chỉ cho phép tải lên các định dạng ảnh (JPEG, PNG, GIF, WEBP)"));
    }
    cb(null, true);
  }
});

export const uploadImage = async (req, res, next) => {
  try {
    // Nếu không có file được tải lên thì bỏ qua, đi đến controller tiếp theo
    if (!req.file) return next();

    // Viết hàm trả về Promise bọc lấy luồng upload của Cloudinary
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "uploads" }, // Tên thư mục lưu trên Cloudinary
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        // Bơm trực tiếp buffer vào stream của Cloudinary và kết thúc quá trình truyền
        stream.end(req.file.buffer);
      });
    };

    // Chờ quá trình upload hoàn tất
    const result = await streamUpload();

    // Gắn URL an toàn của ảnh vừa up vào req.body để lưu vào Database sau đó
    req.body.image = result.secure_url;

    next();
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    next(err);
  }
};