import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { ValidateSignature } from "../utility/PasswordUtility";

declare global {
  namespace express {
  interface Request {
      user: AuthPayload;
    }
  }
}

declare module Express {
    export interface Request {
        user: AuthPayload;
      }
  }

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await ValidateSignature(req);

  if (validate) {
    next();
  } else {
    return res.status(401).json({ message: "User not authorized" });
  }
};
