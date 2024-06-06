import { Request, Response } from "express";
import authService from "./auth.service";
import ApiResponse from "../middleware/response";

class AuthController {
  register = async (req: Request, res: Response) => {
    const body = req.body;
    const data = await authService.registerUser(body);
    new ApiResponse(res).success(data, "registration Success", 201);
  };

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await authService.loginUser(email, password);
    if (token)
      return new ApiResponse(res).success(
        { data: { email, token } },
        "Logged in success",
        200,
      );
    new ApiResponse(res).failed("Invalid email or password");
  }

  async logout(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return new ApiResponse(res).failed("No token provided", 400);
    await authService.logoutUser(token);
    new ApiResponse(res).success({}, "Logged out successfully", 200);
  }

  async getAllUsers(req: Request, res: Response) {
    const data = await authService.getAllUsers();
    new ApiResponse(res).success(data, "All users", 200);
  }

  async me(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1]!;
    const data = await authService.getUserData(token);
    new ApiResponse(res).success(data, "User data", 200);
  }
}

const authController = new AuthController();
export default authController;
