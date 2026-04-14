import { AppError } from "../utils/appError.js";

export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      next(new AppError("Authentication required", 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError("You do not have permission to perform this action", 403));
      return;
    }

    next();
  };
}
