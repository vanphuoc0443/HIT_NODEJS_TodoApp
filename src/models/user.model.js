import { Schema, model } from "mongoose";

const userModel = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    default: "user",
  },
});

export default model("User", userModel);
