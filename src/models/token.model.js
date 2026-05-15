import mongoose, { Schema, model } from "mongoose";

const tokenSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
      index: true,
    },
    expireAt: {
      type: Date,
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default model("Token", tokenSchema);
