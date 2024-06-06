import { Router } from "express";
import authController from "./auth.controller";
import { bodyValidator } from "../middleware/zod.validator";
import { createUserDTO, loginUserDTO } from "./dto/auth.dto";
import authMiddleware from "../middleware/auth.middleware";
const authRouter = Router();

authRouter.post(
  "/register",
  bodyValidator(createUserDTO),
  authController.register,
);
authRouter.post("/login", bodyValidator(loginUserDTO), authController.login);
authRouter.get("/logout", authController.logout);

authRouter.get("/me",authMiddleware.checkAuthenticated, authController.me);

module.exports = authRouter;
