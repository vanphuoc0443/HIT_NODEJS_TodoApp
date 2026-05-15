import { Router } from "express";
import { uploadController } from "../controllers/index.js";
import { uploadMemory, uploadImage } from "../middlewares/uploadCloud.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import loadPermissions from "../middlewares/loadPermissions.middleware.js";
import checkPermission from "../middlewares/permission.middleware.js";
import { PERMISSIONS } from "../constants/permission.constant.js";


const uploadRouter = Router();

uploadRouter.post(
  "/",
  auth,
  loadPermissions,
  checkPermission(PERMISSIONS.UPLOAD_IMAGE),
  uploadMemory.single("Avatar"),
  uploadImage,
  uploadController.uploadImage,
);

export default uploadRouter;
