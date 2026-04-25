import { StatusCodes } from "http-status-codes";
import { response } from "../utils/index.js";

const validate = (schema) => {
  return (req, res, next) => {
    const keys = ["body", "query", "params"];

    for (const key of keys) {
      const rule = schema[key];
      if (!rule) continue;

      const { error } = rule.validate(req[key], {
        abortEarly: false,
      });

      if (error) {
        const messages = error.details.map((d) => d.message).join(",");

        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(response(StatusCodes.BAD_REQUEST, messages));
      }
    }

    next();
  };
};

export default validate;
