import mongoose from "mongoose";
import env from "./env.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.database.mongoURI);
    console.log("Kết nối Database thành công.");
  } catch (error) {
    console.log("Lỗi kết nối: " + error);
    process.exit(1); //DB không kết nối được thì dừng server luôn
  }
};

export default connectDB;
