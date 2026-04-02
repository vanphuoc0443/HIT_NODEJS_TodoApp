import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Kết nối Database thành công.");
  } catch (error) {
    console.log("Lỗi kết nối: " + error);
    process.exit(1); //DB không kết nối được thì dừng server luôn
  }
};

export default connectDB;
