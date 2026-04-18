import dotenv from "dotenv";
dotenv.config();

const env = {
  server: {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
  },
  database: {
    mongoURI: process.env.MONGO_URI,
  },
  bcrypt: {
    saltRounds: process.env.SALT_ROUNDS,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESSTOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESHTOKEN_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESSTOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: process.env.JWT_REFRESHTOKEN_EXPIRES_IN,
  },
};

export default env;
