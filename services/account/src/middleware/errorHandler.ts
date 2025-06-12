import { Request, Response, NextFunction } from 'express';

export function centralErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err); // Log for debugging

  // Customize error response based on error type or status
  const statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
  });
}
