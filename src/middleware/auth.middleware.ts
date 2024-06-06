import { NextFunction, Request, Response } from "express";
import Config from "../config/config";
import ApiResponse from "./response";
import jwt from "jsonwebtoken";
import { decodeToken, getToken } from "../utils/functions";



class AuthMiddleware {
  config = Config(process.env.NODE_ENV);

  async checkAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    const token = getToken(authHeader);
    if (token == null)
      return new ApiResponse(res).failed("Token not found", 401);

    const decoded = await decodeToken(token);

    if (!decoded) {
      return new ApiResponse(res).failed("Invalid token! Please login again");
    }

    next();
  }

  
}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;
