import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes";

interface HTTPError extends Error {
  status?: number;
}

const app = express();

app.use(express.json());
app.use(router);
app.use((error: HTTPError, req: Request, res: Response, next: NextFunction) => {
  const errorMessage = error.message;
  return res.status(400).json({
    message: "Ocorreu um erro ao realizar a operação",
    errorMessage,
  });
});

export { app };
