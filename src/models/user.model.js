import mongoose, { Schema, model } from "mongoose";

const userModel = new Schema({
  username: String,
  password: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

export default model("User", userModel);
