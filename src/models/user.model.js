import { Schema, model } from "mongoose";

const userModel = new Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  avatar: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

export default model("User", userModel);
