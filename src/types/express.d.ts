import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string | null;
        role?: string | null;
      };
      accessToken?: string;
    }
  }
}