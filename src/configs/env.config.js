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
};

export default env;
