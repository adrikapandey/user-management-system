import { validationResult } from "express-validator";

export function validateRequest(req, _res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    next();
    return;
  }

  next({
    statusCode: 400,
    message: "Validation failed",
    errors: result.array()
  });
}
