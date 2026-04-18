import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./configs/db.config.js";
import dotenv from "dotenv";
import router from "./routes/index.js";
import { error } from "console";
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Cấu hình thư mục chứa file tĩnh
app.use(express.static(path.join(__dirname, "public")));

// Middleware Cho phép server đọc JSON từ body request
app.use(express.json());
// Middleware Cho phép server đọc dữ liệu từ form (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Middleware cho phép server đọc cookie
app.use(cookieParser());
// Sử dụng router
app.use("/api/v1", router);

//Đăng ký middleware xử lý lỗi
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => console.log("Server is running on port 3000"));
  })
  .catch(() => {
    process.exit(1);
  });
