// utils/wrapAsync.ts
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "@/controllers/BaseController";

export function wrapAsync(
  controller: (req: Request, res: Response) => Promise<Response<ApiResponse>>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(controller(req, res)).catch(next);
  };
}
