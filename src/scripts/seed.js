import mongoose from "mongoose";
import bcrypt from "bcrypt";
import env from "../configs/env.config.js";
import { userModel, roleModel, permissionModel } from "../models/index.js";
import { PERMISSIONS } from "../constants/permission.constant.js";

const seed = async () => {
  await mongoose.connect(env.database.mongoURI);

  // Xóa dữ liệu cũ
  await permissionModel.deleteMany({});
  await roleModel.deleteMany({});
  await userModel.deleteMany({ username: "superadmin" });

  // Tạo permissions từ constant
  const permDocs = Object.values(PERMISSIONS).map((name) => ({ name }));
  const perms = await permissionModel.insertMany(permDocs);

  // Helper: lấy mảng ID theo tên quyền
  const getIds = (names) =>
    perms.filter((p) => names.includes(p.name)).map((p) => p._id);

  // Tạo roles
  const allPerms = Object.values(PERMISSIONS);

  const [adminRole] = await Promise.all([
    roleModel.create({ name: "admin", permissions: getIds(allPerms) }),
    roleModel.create({
      name: "moderator",
      permissions: getIds([
        PERMISSIONS.GET_USER,
        PERMISSIONS.GET_TODO,
        PERMISSIONS.CREATE_TODO,
        PERMISSIONS.UPDATE_TODO,
        PERMISSIONS.DELETE_TODO,
      ]),
    }),
    roleModel.create({
      name: "user",
      permissions: getIds([PERMISSIONS.GET_TODO, PERMISSIONS.CREATE_TODO]),
    }),
  ]);

  // Tạo tài khoản admin mặc định
  const hash = await bcrypt.hash("admin123456", 10);
  await userModel.create({
    username: "superadmin",
    password: hash,
    role: adminRole._id,
  });

  console.log("Seed thành công.");
  console.log("Tài khoản: superadmin / admin123456");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed thất bại:", err);
  process.exit(1);
});
