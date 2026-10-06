import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../types";

export const systemAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers["x-webhook-secret"] as string;
  const sytemKey = process.env.WEBHOOK_KEY_ADCO_REWARDS || "";
  console.log({ token, sytemKey });

  if (!sytemKey) return;
  try {
    if (!token || token.length !== sytemKey.length) {
      res.status(401).json({ message: "Token no proporcionado" });
      return;
    }

    if (sytemKey !== token) {
      res.status(401).json({ message: "Key invalida" });
      return;
    }

    req.body = {
      ...req.body,
      password: process.env.PASSWORD_ADCO_REWARDS_DEFAULT as string,
    };
    next();
  } catch (e) {
    console.log(e);

    res.status(401).json({ message: "Token invalido o expirado" });
  }
};
