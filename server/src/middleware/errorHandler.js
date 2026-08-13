import { StatusCodes } from "http-status-codes";
// import pkg from "http-status-codes";
// const { StatusCodes } = pkg;

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error]: ${err.message}`);

  if (err) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      message: "A record with that value already exists",
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error",
  });
};
