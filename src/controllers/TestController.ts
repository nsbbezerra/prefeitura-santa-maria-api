import { Request, Response, NextFunction } from "express";

const Test = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(201).json({ message: "ok" });
};

export { Test };
