export class ApiError extends Error {
  statusCode: number;
  success: boolean;
  error: string;
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    error: string,
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;

    this.success = false;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
