import { Router } from "express";
import { uploadController } from "../controllers/index.js";
import { uploadMemory, uploadImage } from "../middlewares/uploadCloud.middleware.js";

const uploadRouter = Router();

uploadRouter.post(
"/",(req, res, next) => {
  console.log("METHOD:", req.method)
  console.log("CONTENT-TYPE:", req.headers["content-type"])
  next()
},
uploadMemory.single("Avatar"),
uploadImage,
uploadController.uploadImage,
);

export default uploadRouter;