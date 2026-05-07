import catchAsync from "../utils/catchAsync.js";

const loadPermissions = catchAsync(async (req, res, next) => {
    if (!req.user) {
        req.permissions = [];
        return next();
    }

    await req.user.populate({
        path: "role",
        populate: {
            path: "permissions",
        },
    });

    const permissionsObjects = req.user.role?.permissions || [];
    req.permissions = permissionsObjects.map((p) => p.name);

    next();
});

export default loadPermissions;