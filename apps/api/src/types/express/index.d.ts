import "express";

declare global {
  namespace Express {
    /**
 Adding user object in the request for authentication purposes
 */
    interface Request {
      user: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}
