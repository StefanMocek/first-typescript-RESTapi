import { Request, Response, NextFunction } from "express";
import token from '@/utils/token'
// import { verifyToken } from "@/utils/token";
import userModel from "@/resources/user/user.model";
import Token from "@/utils/interfaces/token.interface";
import HttpException from "@/utils/exceptions/http.exception";
import jwt from "jsonwebtoken";

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const bearer = req.headers.authorization;
  console.log(bearer)
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new HttpException(401, "Unauthorised"));
  }

  const accessToken = bearer.split("Bearer ")[1].trim();
  console.log(accessToken)
  try {
    const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
      accessToken
    );
    console.log(payload)
    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, "Unauthorised"));
    }

    const user = await userModel
      .findById(payload.id)
      .select("-password")
      .exec();

    if (!user) {
      return next(new HttpException(401, "Unauthorised"));
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(new HttpException(401, "Unauthorised"));
  }
}

export default authenticatedMiddleware;
