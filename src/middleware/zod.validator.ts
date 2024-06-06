import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";

export const bodyValidator =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req.body);
      req.body = data;
      next();
    } catch (error) {
      const errorObj =
        error instanceof ZodError ? error.flatten().fieldErrors : {};
      res.status(422).json({
        success: false,
        message: "Validation error!",
        errors: errorObj,
        errorRaw: error,
      });
    }
  };
