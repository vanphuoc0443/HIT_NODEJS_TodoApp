import jwt from "jsonwebtoken";
import env from "../configs/env.config.js";

//lấy token từ header
const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  return token;
};

//tạo token
const generateAccessToken = (userId) => {
  const payload = { id: userId };

  const token = jwt.sign(payload, env.jwt.accessTokenSecret, {
    expiresIn: env.jwt.accessTokenExpiresIn,
  });

  return token;
};

const generateRefreshToken = (userId) => {
  const payload = { id: userId };

  const token = jwt.sign(payload, env.jwt.refreshTokenSecret, {
    expiresIn: env.jwt.refreshTokenExpiresIn,
  });

  return token;
};

//giải mã token
const verifyAccessToken = (token) => {
  const payload = jwt.verify(token, env.jwt.accessTokenSecret);
  return payload;
};

const verifyRefreshToken = (token) => {
  const payload = jwt.verify(token, env.jwt.refreshTokenSecret);
  return payload;
};

export default {
  extractToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
