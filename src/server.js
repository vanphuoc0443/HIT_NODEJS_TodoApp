import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./configs/db.config.js";
import { userModel } from "./models/index.js";
import dotenv from "dotenv";
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

app.post("/user", async (req, res) => {
  try {
    const { username, password } = req.body;

    // validate cơ bản
    if (!username || !password) {
      throw new Error("Thiếu username hoặc password");
    }

    // kiểm tra user tồn tại
    const user = await userModel.findOne({ username });
    if (user) {
      throw new Error("User đã tồn tại");
    }

    // tạo user
    const newUser = await userModel.create({
      username,
      password,
    });

    return res.status(201).json({
      statusCode: 201,
      message: "Tạo người dùng thành công.",
      data: newUser,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lỗi server",
    });
  }
});

connectDB()
  .then(() => {
    app.listen(port, () => console.log("Server is running on port 3000"));
  })
  .catch(() => {
    process.exit(1);
  });
