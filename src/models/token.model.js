import mongoose, { Schema, model } from "mongoose";

const tokenSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      expires: 7 * 24 * 60 * 60, // Token hết hạn sau 7 ngày
    },
  },
  {
    timestamps: true,
  },
);

export default model("Token", tokenSchema);
